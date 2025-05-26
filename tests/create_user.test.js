const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const LOGIN_URL = 'http://localhost:3000/login';
const DASHBOARD_URL = 'http://localhost:3000/dashboard';
const USERS_URL = 'http://localhost:3000/users';
const URL_CREATE_USER = 'http://localhost:3000/users/create';

const LOGIN_USERNAME = 'user1@pos.vn';
const LOGIN_PASSWORD = '123456';

async function doLogin(driver, username, password) {
  await driver.get(LOGIN_URL);
  await driver.wait(until.elementLocated(By.id('username')), 5000);
  await driver.findElement(By.id('username')).sendKeys(username);
  await driver.findElement(By.id('password')).sendKeys(password);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlIs(DASHBOARD_URL), 5000);
  console.log('Đăng nhập thành công!');
}

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

  async function fillUserForm(userData, isFirstFill = false) {
    if (isFirstFill) {
      console.log(`Điều hướng đến trang tạo người dùng: ${URL_CREATE_USER}`);
      await driver.get(URL_CREATE_USER);
      await driver.wait(until.urlIs(URL_CREATE_USER), 10000);
    }

    try {
      // Đợi form load
      await driver.wait(until.elementLocated(By.css('input[name="user_name"]')), 10000);

      // Điền thông tin người dùng
      if (userData.user_name !== undefined) {
        const nameInput = await driver.findElement(By.css('input[name="user_name"]'));
        await nameInput.clear();
        await nameInput.sendKeys(userData.user_name);
      }

      if (userData.email !== undefined) {
        const emailInput = await driver.findElement(By.css('input[name="email"]'));
        await emailInput.clear();
        await emailInput.sendKeys(userData.email);
      }

      if (userData.password !== undefined) {
        const passwordInput = await driver.findElement(By.css('input[name="password"]'));
        await passwordInput.clear();
        await passwordInput.sendKeys(userData.password);
      }

      if (userData.confirmPassword !== undefined) {
        const confirmInput = await driver.findElement(By.css('input[name="confirmPassword"]'));
        await confirmInput.clear();
        await confirmInput.sendKeys(userData.confirmPassword);
      }

      if (userData.gender_id !== undefined) {
        const genderSelect = await driver.findElement(By.css('select[name="gender_id"]'));
        await genderSelect.click();
        await driver.sleep(500);
        const option = await driver.findElement(By.css(`option[value="${userData.gender_id}"]`));
        await option.click();
      }

      if (userData.phone_number !== undefined) {
        const phoneInput = await driver.findElement(By.css('input[name="phone_number"]'));
        await phoneInput.clear();
        await phoneInput.sendKeys(userData.phone_number);
      }

      if (userData.position_id !== undefined) {
        const positionSelect = await driver.findElement(By.css('select[name="position_id"]'));
        await positionSelect.click();
        await driver.sleep(500);
        const option = await driver.findElement(By.css(`option[value="${userData.position_id}"]`));
        await option.click();
      }

      if (userData.shop_id !== undefined) {
        const shopSelect = await driver.findElement(By.css('select[name="shop_id"]'));
        await shopSelect.click();
        await driver.sleep(500);
        const option = await driver.findElement(By.css(`option[value="${userData.shop_id}"]`));
        await option.click();
      }

      // Chọn quyền nếu có
      if (userData.permissions && userData.permissions.length > 0) {
        for (const permission of userData.permissions) {
          const checkbox = await driver.findElement(By.css(`input[value="${permission}"]`));
          await checkbox.click();
          await driver.sleep(200);
        }
      }

    } catch (error) {
      console.error('Lỗi khi điền form:', error);
      throw error;
    }
  }

  async function submitForm() {
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
  }

  async function getValidationText(fieldName) {
    try {
      const input = await driver.findElement(By.css(`input[name="${fieldName}"]`));
      const describedBy = await input.getAttribute('aria-describedby');
      if (describedBy) {
        const errorEl = await driver.findElement(By.id(describedBy));
        const classAttribute = await errorEl.getAttribute('class');
        if (classAttribute.includes('Mui-error')) {
          return await errorEl.getText();
        }
      }
      return null;
    } catch (e) {
      console.error(`Không tìm thấy validation text cho ${fieldName}:`, e.message);
      return null;
    }
  }

  async function getSnackbarMessage() {
    try {
      const snackbarAlert = await driver.wait(
        until.elementLocated(By.css('div[role="alert"].MuiAlert-filled')),
        5000
      );
      return await snackbarAlert.getText();
    } catch (e) {
      console.log('Không tìm thấy Snackbar message:', e.message);
      return null;
    }
  }

  try {
    await doLogin(driver, LOGIN_USERNAME, LOGIN_PASSWORD);
    await driver.sleep(1000);

    console.log('--- Test Create User ---');

    // Test case 1: Validate các trường bắt buộc
    console.log('\nTest 1: Validate các trường bắt buộc');

    // 1.1 Tên người dùng trống
    await fillUserForm({
      email: 'test@example.com',
      user_name: '',
      password: '123456',
      confirmPassword: '123456',
      gender_id: 1,
      phone_number: '0123456789',
      position_id: 1,
      shop_id: 1
    }, true);
    await submitForm();
    let err = await getValidationText('user_name');
    if (err === 'Tên người dùng là bắt buộc') console.log('✅ Tên người dùng trống');
    else console.log('❌ Tên người dùng trống:', err);
    await driver.sleep(500);

    // 1.2 Email trống
    await fillUserForm({
      email: '',
      user_name: 'Test User',
      password: '123456',
      confirmPassword: '123456',
      gender_id: 1,
      phone_number: '0123456789',
      position_id: 1,
      shop_id: 1
    }, true);
    await submitForm();
    err = await getValidationText('email');
    if (err === 'Email là bắt buộc') console.log('✅ Email trống');
    else console.log('❌ Email trống:', err);
    await driver.sleep(500);

    // 1.3 Email sai định dạng
    await fillUserForm({
      email: 'invalid@email',
      user_name: 'Test User',
      password: '123456',
      confirmPassword: '123456',
      gender_id: 1,
      phone_number: '0123456789',
      position_id: 1,
      shop_id: 1
    }, true);
    await submitForm();
    err = await getValidationText('email');
    if (err === 'Email không hợp lệ') console.log('✅ Email sai định dạng');
    else console.log('❌ Email sai định dạng:', err);
    await driver.sleep(500);

    // 1.4 Mật khẩu trống
    await fillUserForm({
      email: 'test@example.com',
      user_name: 'Test User',
      password: '',
      confirmPassword: '',
      gender_id: 1,
      phone_number: '0123456789',
      position_id: 1,
      shop_id: 1
    }, true);
    await submitForm();
    err = await getValidationText('password');
    if (err === 'Mật khẩu là bắt buộc') console.log('✅ Mật khẩu trống');
    else console.log('❌ Mật khẩu trống:', err);
    await driver.sleep(500);

    // 1.5 Mật khẩu xác nhận không khớp
    await fillUserForm({
      email: 'test@example.com',
      user_name: 'Test User',
      password: '123456',
      confirmPassword: '1234567',
      gender_id: 1,
      phone_number: '0123456789',
      position_id: 1,
      shop_id: 1
    }, true);
    await submitForm();
    err = await getValidationText('confirmPassword');
    if (err === 'Mật khẩu không khớp') console.log('✅ Mật khẩu xác nhận không khớp');
    else console.log('❌ Mật khẩu xác nhận không khớp:', err);
    await driver.sleep(500);

    // Test case 2: Tạo người dùng thành công
    console.log('\nTest 2: Tạo người dùng thành công');
    const testEmail = `test.user.${Date.now()}@example.com`;
    await fillUserForm({
      email: testEmail,
      user_name: 'Test User Success',
      password: '123456',
      confirmPassword: '123456',
      gender_id: 1,
      phone_number: '0123456789',
      position_id: 1,
      shop_id: 1,
      permissions: ['user-view', 'user-create', 'user-update', 'user-delete']
    }, true);
    await submitForm();
    let msg = await getSnackbarMessage();
    if (msg && msg.includes('Tạo người dùng thành công')) {
      console.log('✅ Tạo người dùng thành công');
      
      // Kiểm tra redirect về trang danh sách
      await driver.wait(until.urlIs(USERS_URL), 5000);
      console.log('✅ Chuyển hướng về trang danh sách người dùng');
      
      // Kiểm tra người dùng mới trong danh sách
      try {
        const userRow = await driver.wait(
          until.elementLocated(By.xpath(`//td[contains(text(),'${testEmail}')]`)),
          5000
        );
        console.log('✅ Người dùng mới xuất hiện trong danh sách');
      } catch (e) {
        console.log('❌ Không tìm thấy người dùng mới trong danh sách');
      }
    } else {
      console.log('❌ Tạo người dùng thất bại:', msg);
    }
    await driver.sleep(1000);

    // Test case 3: Email đã tồn tại
    console.log('\nTest 3: Email đã tồn tại');
    await fillUserForm({
      email: testEmail, // Sử dụng email đã tạo ở test case 2
      user_name: 'Test User Duplicate',
      password: '123456',
      confirmPassword: '123456',
      gender_id: 1,
      phone_number: '0123456789',
      position_id: 1,
      shop_id: 1
    }, true);
    await submitForm();
    msg = await getSnackbarMessage();
    if (msg && msg.toLowerCase().includes('email đã tồn tại')) {
      console.log('✅ Báo lỗi email đã tồn tại');
    } else {
      console.log('❌ Không báo lỗi email đã tồn tại:', msg);
    }
    await driver.sleep(1000);

    // Test case 4: Login với user vừa tạo
    console.log('\nTest 4: Login với user vừa tạo');
    await doLogin(driver, testEmail, '123456');
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl === DASHBOARD_URL) {
      console.log('✅ Đăng nhập thành công với user mới');
    } else {
      console.log('❌ Đăng nhập thất bại với user mới');
    }

  } finally {
    await driver.quit();
  }
}

runTest();
