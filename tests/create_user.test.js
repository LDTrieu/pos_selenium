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
      await driver.sleep(1000); // Đợi form load hoàn toàn
    }

    try {
      // Đợi form load
      await driver.wait(until.elementLocated(By.css('form')), 10000);

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
        // Click vào MUI Select để mở dropdown
        const genderSelect = await driver.findElement(By.css('[data-testid="gender-select"]'));
        await genderSelect.click();
        await driver.sleep(500);
        
        // Chọn option từ MUI Menu
        const option = await driver.wait(
          until.elementLocated(By.css(`li[data-value="${userData.gender_id}"]`)),
          5000
        );
        await option.click();
        await driver.sleep(300);
      }

      if (userData.phone_number !== undefined) {
        const phoneInput = await driver.findElement(By.css('input[name="phone_number"]'));
        await phoneInput.clear();
        await phoneInput.sendKeys(userData.phone_number);
      }

      if (userData.position_id !== undefined) {
        // Click vào MUI Select để mở dropdown
        const positionSelect = await driver.findElement(By.css('#position_id'));
        await positionSelect.click();
        await driver.sleep(500);
        
        // Chọn option từ MUI Menu
        const option = await driver.wait(
          until.elementLocated(By.css(`li[data-value="${userData.position_id}"]`)),
          5000
        );
        await option.click();
        await driver.sleep(300);
      }

      if (userData.shop_id !== undefined) {
        // Click vào MUI Select để mở dropdown
        const shopSelect = await driver.findElement(By.css('#shop_id'));
        await shopSelect.click();
        await driver.sleep(500);
        
        // Chọn option từ MUI Menu
        const option = await driver.wait(
          until.elementLocated(By.css(`li[data-value="${userData.shop_id}"]`)),
          5000
        );
        await option.click();
        await driver.sleep(300);
      }

      // Chọn quyền nếu có
      if (userData.permissions && userData.permissions.length > 0) {
        // Đợi cho phần quyền load
        await driver.wait(until.elementLocated(By.css('.permission-module')), 5000);
        
        const permissionMap = {
          'user-view': 'Xem',
          'user-create': 'Tạo mới',
          'user-update': 'Cập nhật',
          'user-delete': 'Xóa',
          'product-view': 'Xem',
          'product-create': 'Tạo mới',
          'product-update': 'Cập nhật',
          'product-delete': 'Xóa',
          'order-view': 'Xem',
          'order-create': 'Tạo mới',
          'order-update': 'Cập nhật',
          'order-delete': 'Xóa',
          'order-approve': 'Duyệt',
          'report-daily-view': 'Daily-view',
          'report-monthly-view': 'Monthly-view',
          'report-export': 'Xuất',
          'permission-manage': 'Quản lý'
        };

        for (const permission of userData.permissions) {
          try {
            // Tìm module chứa quyền
            const permissionText = permissionMap[permission];
            if (!permissionText) {
              console.warn(`Không tìm thấy text mapping cho quyền: ${permission}`);
              continue;
            }

            // Tìm và click vào label của checkbox
            const label = await driver.findElement(
              By.xpath(`//span[contains(@class, 'MuiFormControlLabel-label') and contains(text(), '${permissionText}')]`)
            );
            await driver.executeScript("arguments[0].scrollIntoView(true);", label);
            await driver.sleep(200);
            await label.click();
            await driver.sleep(200);
          } catch (error) {
            console.error(`Lỗi khi chọn quyền ${permission}:`, error.message);
          }
        }
      }

    } catch (error) {
      console.error('Lỗi khi điền form:', error);
      throw error;
    }
  }

  async function submitForm() {
    // Tìm nút submit bằng text
    const submitBtn = await driver.findElement(By.xpath("//button[contains(text(), 'LƯU')]"));
    await submitBtn.click();
  }

  async function getSnackbarMessage() {
    try {
      // Đợi Snackbar xuất hiện
      const snackbarAlert = await driver.wait(
        until.elementLocated(By.css('.MuiAlert-root')),
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

    // Test case: Tạo người dùng thành công
    console.log('\nTest: Tạo người dùng thành công');
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
      
      // Điều hướng về trang danh sách users
      await driver.get(USERS_URL);
      await driver.wait(until.urlIs(USERS_URL), 5000);
      console.log('✅ Đã điều hướng về trang danh sách người dùng');

      await driver.sleep(2000); // Đợi trang load
      
      // Tìm kiếm email vừa tạo
      try {
        console.log('Bắt đầu tìm kiếm với email:', testEmail);
        
        // Tìm input search trong Paper container
        const searchInput = await driver.findElement(
          By.css('.user-management-filter-container input.MuiInputBase-input')
        );
        console.log('Đã tìm thấy input search');
        
        // Clear và nhập email mới
        await searchInput.clear();
        console.log('Đã clear input search');
        
        await searchInput.sendKeys(testEmail);
        console.log('Đã nhập email:', testEmail);
        
        // Click nút TÌM KIẾM trong Grid container
        const searchButton = await driver.findElement(
          By.css('.user-management-filter-container button.MuiButton-contained')
        );
        await searchButton.click();
        console.log('Đã click nút TÌM KIẾM');
        
        // Đợi kết quả tìm kiếm
        await driver.sleep(2000);
        console.log('Đã đợi 2 giây sau khi tìm kiếm');
        
        // Kiểm tra xem có dòng nào trong bảng không
        const rows = await driver.findElements(By.css('tbody tr'));
        console.log('Số dòng tìm thấy:', rows.length);
        
        if (rows.length > 0) {
          // Kiểm tra email trong dòng đầu tiên
          const emailText = await rows[0].findElement(By.xpath(`.//div[contains(text(), 'Email:')]`)).getText();
          console.log('Email tìm thấy trong dòng đầu tiên:', emailText);
          
          if (emailText.includes(testEmail)) {
            console.log('✅ Tìm thấy email trong kết quả tìm kiếm:', testEmail);
          } else {
            console.log('❌ Email không khớp.');
            console.log('Email cần tìm:', testEmail);
            console.log('Email tìm thấy:', emailText);
          }
        } else {
          console.log('❌ Không có kết quả tìm kiếm nào');
        }

      } catch (e) {
        console.log('❌ Lỗi khi tìm kiếm email. Chi tiết lỗi:', e.message);
        console.error('Stack trace:', e.stack);
      }
    } else {
      console.log('❌ Tạo người dùng thất bại:', msg);
    }

  } finally {
    await driver.quit();
  }
}

runTest();
