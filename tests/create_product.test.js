const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const LOGIN_URL = 'http://localhost:3000/login';
const DASHBOARD_URL = 'http://localhost:3000/dashboard';
const URL_CREATE_PRODUCT = 'http://localhost:3000/products/create';
const PRODUCTS_URL = 'http://localhost:3000/products'; 

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

  async function fillProductForm(productData, isFirstFill = false) {
    if (isFirstFill) {
        console.log(`Attempting to navigate to: ${URL_CREATE_PRODUCT}`);
        await driver.get(URL_CREATE_PRODUCT);
        console.log(`driver.get(${URL_CREATE_PRODUCT}) executed. Waiting for URL to match...`);
        try {
            await driver.wait(until.urlIs(URL_CREATE_PRODUCT), 15000); // Tăng thời gian chờ
            const confirmedUrl = await driver.getCurrentUrl();
            console.log(`URL confirmed: ${confirmedUrl}`);
        } catch (e) {
            const currentUrlBeforeFail = await driver.getCurrentUrl();
            console.error(`Timeout waiting for URL to be ${URL_CREATE_PRODUCT}. Current URL: ${currentUrlBeforeFail}`);
            throw e;
        }
    }
    try {
      await driver.wait(until.elementLocated(By.css('input[name="name"]')), 15000); // Tăng thời gian chờ
    } catch (e) {
      const currentUrlAtError = await driver.getCurrentUrl();
      console.error(`Không thể tìm thấy input Tên Sản Phẩm. URL hiện tại khi lỗi: ${currentUrlAtError}. Error: ${e.message}`);
      throw e; 
    }
    
    // Clear and fill form fields
    const nameInput = await driver.findElement(By.css('input[name="name"]'));
    await nameInput.clear();
    if (productData.name !== undefined) await nameInput.sendKeys(productData.name);

    const skuInput = await driver.findElement(By.css('input[name="sku"]'));
    await skuInput.clear();
    if (productData.sku !== undefined) await skuInput.sendKeys(productData.sku);

    const priceInput = await driver.findElement(By.css('input[name="price"]'));
    await priceInput.clear();
    if (productData.price !== undefined) await priceInput.sendKeys(String(productData.price));

    if (productData.category_id !== undefined) {
      const selectTrigger = await driver.findElement(By.id('category_id'));
      await selectTrigger.click();
      await driver.sleep(500); // Chờ dropdown mở
      const option = await driver.wait(until.elementLocated(By.xpath(`//li[@data-value='${productData.category_id}']`)), 5000);
      await option.click();
      await driver.sleep(300); // Chờ dropdown đóng
    } else {
    }

    const imageInput = await driver.findElement(By.css('input[name="image"]'));
    await imageInput.clear();
    if (productData.image !== undefined) await imageInput.sendKeys(productData.image);

    const descInput = await driver.findElement(By.css('textarea[name="description"]'));
    await descInput.clear();
    if (productData.description !== undefined) await descInput.sendKeys(productData.description);

    if (productData.is_available !== undefined) {
      const toggle = await driver.findElement(By.css('input[name="is_available"]'));
      const isChecked = await toggle.isSelected();
      if (productData.is_available !== isChecked) {
        await driver.findElement(By.xpath(`//input[@name='is_available']/parent::span`)).click();
      }
    }
  }

  async function submitForm() {
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
  }

  // Sửa selector cho helperText của MUI TextField
  async function getValidationText(fieldName) {
    try {
      // Tìm input theo name
      const input = await driver.findElement(By.css(`input[name="${fieldName}"]`));
      // Lấy aria-describedby (id helperText động)
      const describedBy = await input.getAttribute('aria-describedby');
      if (describedBy) {
        // Tìm helperText theo id động
        const errorEl = await driver.findElement(By.id(describedBy));
        const classAttribute = await errorEl.getAttribute('class');
        if (classAttribute.includes('Mui-error')) {
          return await errorEl.getText();
        }
      }
      // Nếu không có aria-describedby, fallback: tìm p.Mui-error gần input
      const parent = await input.findElement(By.xpath('ancestor::div[contains(@class,"MuiFormControl-root")]'));
      const errorEls = await parent.findElements(By.css('p.Mui-error'));
      for (let el of errorEls) {
        const text = await el.getText();
        if (text) return text;
      }
      return null;
    } catch (e) {
      try {
        const formHtml = await driver.findElement(By.css('form')).getAttribute('outerHTML');
        console.error(`Không tìm thấy helperText cho ${fieldName}. HTML form:\n${formHtml}`);
      } catch (err) {
        console.error('Không lấy được HTML form:', err.message);
      }
      return null;
    }
  }

  async function getSnackbarMessage() {
    try {
      // Chờ Alert bên trong Snackbar xuất hiện
      const snackbarAlert = await driver.wait(until.elementLocated(By.css('div[role="alert"].MuiAlert-filled')), 5000);
      return await snackbarAlert.getText();
    } catch (e) {
      console.log('Không tìm thấy Snackbar message:', e.message);
      return null;
    }
  }

  try {
    await doLogin(driver, LOGIN_USERNAME, LOGIN_PASSWORD);
    console.log('Đăng nhập hoàn tất, đợi chút trước khi điều hướng...');
    await driver.sleep(1000); // Thêm độ trễ nhỏ sau khi đăng nhập

    console.log('--- Test Create Product --- ');

    // 1. Validate trường bắt buộc và giá trị hợp lệ
    console.log('\nTest 1: Validate trường bắt buộc và giá trị hợp lệ');
    // Tên sản phẩm để trống
    await fillProductForm({ 
        name: '', 
        sku: `SKU_VALIDATE_NAME_${Date.now()}`,
        price: 1000, 
        category_id: 1, 
        is_available: true 
    }, true);
    await submitForm();
    let err = await getValidationText('name');
    if (err === 'Vui lòng nhập tên sản phẩm') console.log('✅ Tên sản phẩm để trống');
    else console.log('FAIL - Tên sản phẩm để trống:', err);
    await driver.sleep(500);

    // SKU để trống
    await fillProductForm({ 
        name: 'Sản phẩm Test', 
        sku: '',
        price: 1000, 
        category_id: 1, 
        is_available: true 
    }, true);
    await submitForm();
    err = await getValidationText('sku');
    if (err === 'Vui lòng nhập mã SKU') console.log('✅ SKU để trống');
    else console.log('FAIL - SKU để trống:', err);
    await driver.sleep(500);

    // Giá <= 0
    await fillProductForm({ 
        name: 'Sản phẩm Test', 
        sku: `SKU_VALIDATE_PRICE_${Date.now()}`,
        price: 0, 
        category_id: 1, 
        is_available: true 
    }, true);
    await submitForm();
    err = await getValidationText('price');
    if (err === 'Giá phải lớn hơn 0') console.log('✅ Giá <= 0');
    else console.log('FAIL - Giá <= 0:', err);
    await driver.sleep(500);

    // 2. SKU trùng lặp
    console.log('\nTest 2: SKU trùng lặp');
    const duplicateSku = `SKU_TEST_DUPLICATE_${Date.now()}`;
    // Tạo sản phẩm đầu tiên
    await fillProductForm({
      name: 'Sản phầm Tạo thành công - SKU Test trùng',
      sku: duplicateSku,
      price: 1000,
      category_id: 1,
      is_available: true,
      image: 'https://product.hstatic.net/1000075078/product/1737357048_uong-den-sua-da_5876b3829fe94af788996ca234a7894f.png',
  
    }, true);
    await submitForm();
    let msg = await getSnackbarMessage();
    if (msg && msg.includes('Tạo sản phẩm thành công')) {
      console.log('✅ Tạo sản phẩm đầu tiên với SKU mới');
    } else {
      console.log('FAIL - Không tạo được sản phẩm đầu tiên:', msg);
    }
    await driver.sleep(1000);
    // Tạo lại với SKU trùng
    await fillProductForm({
      name: 'Sản phầm Tạo thất bại - SKU Test trùng',
      sku: duplicateSku,
      price: 2000,
      category_id: 1,
      is_available: true
    }, true);
    await submitForm();
    msg = await getSnackbarMessage();
    if (msg && (msg.toLowerCase().includes('sku đã tồn tại') || msg.toLowerCase().includes('product with sku'))) {
      console.log('✅ Báo lỗi SKU trùng');
    } else {
      console.log('FAIL - Không báo lỗi SKU trùng:', msg);
    }
    await driver.sleep(1000);

    // 3. Tạo sản phẩm thành công và kiểm tra lại trên trang quản lý sản phẩm
    console.log('\nTest 3: Tạo sản phẩm thành công và kiểm tra lại trên trang quản lý sản phẩm');
    const successSku = `SKU_SUCCESS_${Date.now()}`;
    const productName = `Sản phẩm Thành Công ${Date.now()}`;
    await fillProductForm({
      name: productName,
      sku: successSku,
      price: 12345,
      category_id: 1,
      image: 'https://product.hstatic.net/1000075078/product/1737357048_uong-den-sua-da_5876b3829fe94af788996ca234a7894f.png',
      description: 'Mô tả sản phẩm test thành công',
      is_available: true,
    }, true);
    await submitForm();
    msg = await getSnackbarMessage();
    if (msg && msg.includes('Tạo sản phẩm thành công')) {
      console.log('✅ Tạo sản phẩm thành công');
    } else {
      console.log('FAIL - Không tạo được sản phẩm:', msg);
    }
    // Kiểm tra lại trên trang quản lý sản phẩm
    await driver.get(PRODUCTS_URL);
    await driver.wait(until.urlIs(PRODUCTS_URL), 10000);
    // Tìm sản phẩm vừa tạo trong danh sách (giả sử có table và có thể tìm theo SKU)
    try {
      const row = await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(),'${successSku}')]`)), 5000);
      const rowText = await row.getText();
      if (rowText.includes(successSku)) {
        console.log('✅ Sản phẩm mới xuất hiện trong danh sách');
        // Kiểm tra trạng thái Đang bán (cell thứ 7 trong cùng hàng)
        try {
          // Lấy cell trạng thái (td thứ 7, index bắt đầu từ 1)
          const statusCell = await row.findElement(By.xpath('following-sibling::td[4]'));
          const statusText = await statusCell.getText();
          if (statusText.includes('Đang bán')) {
            console.log('✅ Trạng thái mặc định là Đang bán');
          } else {
            console.log('FAIL - Trạng thái không phải Đang bán:', statusText);
          }
        } catch (e) {
          console.log('FAIL - Không tìm thấy cột trạng thái Đang bán:', e.message);
        }
      } else {
        console.log('FAIL - Không tìm thấy sản phẩm mới trong danh sách');
      }
    } catch (e) {
      console.log('FAIL - Không tìm thấy sản phẩm mới trong danh sách:', e.message);
    }
    await driver.sleep(1000);

  } finally {
    await driver.quit();
  }
}

runTest();
