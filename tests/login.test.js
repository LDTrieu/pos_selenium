const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const URL = 'http://localhost:3000/login';
const API_URL = 'http://localhost:8080/api';

async function runTest() {
  let options = new chrome.Options();
  options.addArguments('--window-size=1920,1080');
  options.addArguments('--disable-features=PasswordLeakDetection');
  
  options.setUserPreferences({
    'profile.password_manager_leak_detection': false
  });
  
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  async function doLogin(username, password, remember = false) {
    await driver.get(URL);
    await driver.wait(until.elementLocated(By.css('form')), 5000);
    
    const usernameInput = await driver.findElement(By.id('username'));
    const passwordInput = await driver.findElement(By.id('password'));
    
    await usernameInput.clear();
    await passwordInput.clear();

    if (username !== null) {
      await usernameInput.sendKeys(username);
    }
    if (password !== null) {
      await passwordInput.sendKeys(password);
    }

    if (remember) {
      const checkbox = await driver.findElement(By.id('remember'));
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        await checkbox.click();
      }
    }

    await driver.findElement(By.css('button[type="submit"]')).click();
  }

  async function doLogout() {
    try {
      await driver.findElement(By.xpath("//span[text()='Sign Out']")).click();
      await driver.wait(until.urlIs(URL), 5000);
    } catch (error) {
      console.log('Lỗi khi đăng xuất:', error.message);
    }
  }

  // Helper lấy text lỗi
  async function getErrorText() {
    try {
      let el = await driver.wait(until.elementLocated(By.css('.login-error')), 10000);
      const errorText = await el.getText();
      console.log('Thông báo lỗi UI nhận được:', errorText);
      return errorText;
    } catch (error) {
      console.log('Không tìm thấy thông báo lỗi UI:', error.message);
      return null;
    }
  }

  // Helper kiểm tra login thành công
  async function isLoginSuccess() {
    try {
      await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);
      return true;
    } catch {
      return false;
    }
  }

  try {
    console.log('Test case 1: Đăng nhập thành công');
    console.log('  - Mong đợi API: POST /api/users/login, Response 200 OK');
    await doLogin('user1@pos.vn', '123456');
    await driver.sleep(2000);
    if (await isLoginSuccess()) {
      console.log('PASS: Đăng nhập thành công');
      await doLogout();
      await driver.sleep(2000);
    } else {
      console.log('FAIL: Không chuyển đến trang dashboard');
    }

    console.log('\nTest case 2: Đăng nhập sai mật khẩu');
    console.log('  - Mong đợi API: POST /api/users/login, Response 401 UNAUTHORIZED, Cause: INVALID_EMAIL_OR_PASSWORD');
    await doLogin('user1@pos.vn', '1');
    await driver.sleep(4000);
    let err = await getErrorText();
    if (err === 'Đã xảy ra lỗi khi đăng nhập') {
      console.log('PASS: Hiển thị thông báo lỗi UI đúng');
    } else {
      console.log('FAIL: Thông báo lỗi UI không đúng');
      console.log('Thông báo lỗi UI thực tế:', err);
    }
    await driver.sleep(2000);

    console.log('\nTest case 3: Đăng nhập sai username');
    console.log('  - Mong đợi API: POST /api/users/login, Response 400 BAD_REQUEST, Cause: USER_NOT_FOUND');
    await doLogin('user1000@pos.vn', '123456');
    await driver.sleep(4000);
    err = await getErrorText();
    if (err === 'Đã xảy ra lỗi khi đăng nhập') {
      console.log('PASS: Hiển thị thông báo lỗi UI đúng');
    } else {
      console.log('FAIL: Thông báo lỗi UI không đúng');
      console.log('Thông báo lỗi UI thực tế:', err);
    }
    await driver.sleep(2000);

    console.log('\nTest case 4: Username để trống');
    console.log('  - Mong đợi: Không gọi API, hiển thị lỗi UI');
    await doLogin('', '123456');
    await driver.sleep(2000);
    err = await getErrorText();
    if (err === 'Vui lòng nhập tên đăng nhập và mật khẩu') {
      console.log('PASS: Hiển thị thông báo lỗi UI đúng');
    } else {
      console.log('FAIL: Thông báo lỗi UI không đúng');
      console.log('Thông báo lỗi UI thực tế:', err);
    }
    await driver.sleep(2000);

    console.log('\nTest case 5: Mật khẩu để trống');
    console.log('  - Mong đợi: Không gọi API, hiển thị lỗi UI');
    await doLogin('user1@pos.vn', '');
    await driver.sleep(2000);
    err = await getErrorText();
    if (err === 'Vui lòng nhập tên đăng nhập và mật khẩu') {
      console.log('PASS: Hiển thị thông báo lỗi UI đúng');
    } else {
      console.log('FAIL: Thông báo lỗi UI không đúng');
      console.log('Thông báo lỗi UI thực tế:', err);
    }
    await driver.sleep(2000);

    console.log('\nTest case 6: Username và mật khẩu để trống');
    console.log('  - Mong đợi: Không gọi API, hiển thị lỗi UI');
    await doLogin('', '');
    await driver.sleep(2000);
    err = await getErrorText();
    if (err === 'Vui lòng nhập tên đăng nhập và mật khẩu') {
      console.log('PASS: Hiển thị thông báo lỗi UI đúng');
    } else {
      console.log('FAIL: Thông báo lỗi UI không đúng');
      console.log('Thông báo lỗi UI thực tế:', err);
    }
    await driver.sleep(2000);

    console.log('\nTest case 7: Username sai định dạng');
    console.log('  - Mong đợi API: POST /api/users/login, Response 401 UNAUTHORIZED, Cause: INVALID_EMAIL_OR_PASSWORD');
    await doLogin('user1', '123456');
    await driver.sleep(4000);
    err = await getErrorText();
    if (err === 'Đã xảy ra lỗi khi đăng nhập') {
      console.log('PASS: Hiển thị thông báo lỗi UI đúng');
    } else {
      console.log('FAIL: Thông báo lỗi UI không đúng');
      console.log('Thông báo lỗi UI thực tế:', err);
    }
    await driver.sleep(2000);

    console.log('\nTest case 8: Đăng nhập với ghi nhớ đăng nhập');
    console.log('  - Mong đợi API: POST /api/users/login, Response 200 OK');
    await doLogin('user1@pos.vn', '123456', true);
    await driver.sleep(2000);
    if (await isLoginSuccess()) {
      console.log('PASS: Đăng nhập thành công với ghi nhớ đăng nhập');
      await doLogout();
      await driver.sleep(2000);
    } else {
      console.log('FAIL: Không chuyển đến trang dashboard');
    }

  } finally {
    await driver.quit();
  }
}

runTest();