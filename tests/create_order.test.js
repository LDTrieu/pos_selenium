const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const LOGIN_URL = 'http://localhost:3000/login';
const DASHBOARD_URL = 'http://localhost:3000/dashboard';
const ORDER_URL = 'http://localhost:3000/orders/create';

const LOGIN_USERNAME = 'user1@pos.vn';
const LOGIN_PASSWORD = '123456';

async function doLogin(driver, username, password) {
  await driver.get(LOGIN_URL);
  await driver.wait(until.elementLocated(By.id('username')), 5000);
  await driver.findElement(By.id('username')).sendKeys(username);
  await driver.findElement(By.id('password')).sendKeys(password);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlIs(DASHBOARD_URL), 5000);
  console.log('✅ Đăng nhập thành công!');
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

  async function getSnackbarMessage() {
    try {
      // Đợi Snackbar xuất hiện với timeout 10s thay vì 5s
      const snackbar = await driver.wait(
        until.elementLocated(By.css('.MuiSnackbar-root')), 
        10000
      );
      
      // Đợi alert message trong Snackbar
      const alertMessage = await snackbar.findElement(By.css('.MuiAlert-message'));
      return await alertMessage.getText();
    } catch (e) {
      console.log('Không tìm thấy Snackbar message:', e.message);
      return null;
    }
  }

  async function checkEmptyCart() {
    try {
      // Kiểm tra text "Giỏ hàng (0)"
      const cartHeader = await driver.findElement(By.css('.cart-header'));
      const headerText = await cartHeader.getText();
      
      // Kiểm tra message giỏ hàng trống
      const emptyMessage = await driver.findElement(By.css('.empty-cart-message'));
      const messageText = await emptyMessage.getText();

      return headerText.includes('Giỏ hàng (0)') && 
             messageText.includes('Giỏ hàng trống') &&
             messageText.includes('Vui lòng chọn sản phẩm để thêm vào giỏ hàng');
    } catch (e) {
      console.log('Lỗi khi kiểm tra giỏ hàng trống:', e.message);
      return false;
    }
  }

  try {
    await doLogin(driver, LOGIN_USERNAME, LOGIN_PASSWORD);
    console.log('Đăng nhập hoàn tất, đợi chút trước khi điều hướng...');
    await driver.sleep(1000);

    console.log('--- Test Create Order --- ');

    // 1. Thêm sản phẩm vào giỏ hàng
    console.log('\nTest 1: Thêm sản phẩm vào giỏ hàng');
    await driver.get(ORDER_URL);
    await driver.wait(until.urlIs(ORDER_URL), 10000);

    // Click vào sản phẩm đầu tiên
    const firstProduct = await driver.wait(until.elementLocated(By.css('.product-card')), 5000);
    const productName = await firstProduct.findElement(By.css('.product-name')).getText();
    const productPrice = await firstProduct.findElement(By.css('.product-price')).getText();
    await firstProduct.click();
    await driver.sleep(1000); // Thêm delay sau khi click

    // Kiểm tra sản phẩm trong giỏ hàng
    const cartItem = await driver.wait(until.elementLocated(By.css('.cart-item')), 5000);
    const cartItemName = await cartItem.findElement(By.css('.cart-item-name')).getText();
    const cartItemQuantity = await cartItem.findElement(By.css('.quantity-value')).getText();

    if (cartItemName === productName && cartItemQuantity === '1') {
      console.log('✅ Thêm sản phẩm vào giỏ hàng thành công');
    } else {
      console.log('FAIL - Thêm sản phẩm vào giỏ hàng thất bại');
    }

    // 2. Thay đổi số lượng sản phẩm trong giỏ
    console.log('\nTest 2: Thay đổi số lượng sản phẩm trong giỏ');
    
    // Tăng số lượng
    const increaseBtn = await cartItem.findElement(By.css('.quantity-button:last-child'));
    await increaseBtn.click();
    await driver.sleep(1000); // Tăng thời gian chờ
    
    let updatedQuantity = await cartItem.findElement(By.css('.quantity-value')).getText();
    if (updatedQuantity === '2') {
      console.log('✅ Tăng số lượng sản phẩm thành công');
    } else {
      console.log('FAIL - Tăng số lượng sản phẩm thất bại');
    }

    // Giảm số lượng
    const decreaseBtn = await cartItem.findElement(By.css('.quantity-button:first-child'));
    await decreaseBtn.click();
    await driver.sleep(1000); // Tăng thời gian chờ

    updatedQuantity = await cartItem.findElement(By.css('.quantity-value')).getText();
    if (updatedQuantity === '1') {
      console.log('✅ Giảm số lượng sản phẩm thành công');
    } else {
      console.log('FAIL - Giảm số lượng sản phẩm thất bại');
    }

    // 3. Xóa sản phẩm khỏi giỏ hàng
    console.log('\nTest 3: Xóa sản phẩm khỏi giỏ hàng');
    
    // Thêm lại sản phẩm mới để test xóa
    await firstProduct.click();
    await driver.sleep(1000);

    // Click nút xóa
    const deleteBtn = await driver.findElement(By.css('.MuiIconButton-colorError'));
    await deleteBtn.click();
    await driver.sleep(2000); // Tăng thời gian chờ

    // Kiểm tra giỏ hàng trống
    const isCartEmpty = await checkEmptyCart();
    if (isCartEmpty) {
      console.log('✅ Xóa sản phẩm khỏi giỏ hàng thành công - Giỏ hàng đã trống');
    } else {
      console.log('FAIL - Xóa sản phẩm khỏi giỏ hàng thất bại - Giỏ hàng chưa trống');
    }

    // 4. Đặt hàng thành công
    console.log('\nTest 4: Đặt hàng thành công');
    
    // Thêm sản phẩm vào giỏ
    await firstProduct.click();
    await driver.sleep(1000);

    // Click nút Thanh toán
    const checkoutBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Thanh toán')]"));
    await checkoutBtn.click();
    await driver.sleep(1000);

    // Đợi dialog hiện lên
    const orderDialog = await driver.wait(until.elementLocated(By.css('.MuiDialog-paper')), 5000);

    // Điền thông tin đơn hàng
    const noteInput = await driver.findElement(By.css('textarea[name="note"]'));
    await noteInput.sendKeys('Test đặt hàng tự động');
    await driver.sleep(500);

    // Click nút Xác nhận
    const confirmBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Xác nhận')]"));
    await confirmBtn.click();
    await driver.sleep(2000); // Tăng thời gian chờ sau khi xác nhận

    // Kiểm tra thông báo đặt hàng thành công
    const orderMsg = await getSnackbarMessage();
    console.log('Thông báo đặt hàng:', orderMsg);

    // Đợi dialog PDF hiển thị
    const pdfDialog = await driver.wait(
      until.elementLocated(By.css('.MuiDialog-paper[style*="height: 90vh"]')), 
      5000
    );
    if (pdfDialog) {
      console.log('✅ Hiển thị hóa đơn PDF thành công');
    } else {
      console.log('FAIL - Không hiển thị được hóa đơn PDF');
    }

    // Click nút In hóa đơn
    const printBtn = await driver.findElement(
      By.css('button.MuiButton-containedPrimary[type="button"] svg[data-testid="DownloadIcon"]')
    ).findElement(By.xpath('ancestor::button'));
    await printBtn.click();
    await driver.sleep(1000);
    console.log('✅ Đã click nút In hóa đơn');

    // Đóng dialog hóa đơn
    try {
      // Tìm nút Đóng bằng text và class
      const closeBtn = await driver.wait(
        until.elementLocated(
          By.xpath("//button[contains(@class, 'MuiButton-containedPrimary') and contains(text(), 'Đóng')]")
        ),
        5000
      );
      console.log('✅ Đã tìm thấy nút Đóng');
      
      await closeBtn.click();
      console.log('✅ Đã click nút Đóng');
      await driver.sleep(2000); // Tăng thời gian chờ sau khi đóng dialog

      // Đợi dialog đóng hoàn toàn
      await driver.wait(until.stalenessOf(pdfDialog), 5000);
      console.log('✅ Dialog hóa đơn đã đóng hoàn toàn');
    } catch (e) {
      console.log('FAIL - Lỗi khi đóng dialog:', e.message);
    }

    // Refresh trang để cập nhật trạng thái giỏ hàng
    await driver.navigate().refresh();
    await driver.sleep(2000); // Đợi trang load lại

    // Kiểm tra giỏ hàng trống
    try {
      // Đợi header giỏ hàng hiển thị số lượng 0
      const cartHeader = await driver.wait(
        until.elementLocated(By.css('.cart-header')),
        5000
      );
      const headerText = await cartHeader.getText();
      console.log('Header giỏ hàng hiện tại:', headerText);
      
      if (headerText.includes('Giỏ hàng (0)')) {
        console.log('✅ Header giỏ hàng hiển thị đúng:', headerText);
      } else {
        console.log('FAIL - Header giỏ hàng không hiển thị số lượng 0:', headerText);
        
        // Thử kiểm tra lại sau 2 giây
        await driver.sleep(2000);
        const updatedHeaderText = await cartHeader.getText();
        console.log('Header giỏ hàng sau 2s:', updatedHeaderText);
        
        if (updatedHeaderText.includes('Giỏ hàng (0)')) {
          console.log('✅ Header giỏ hàng đã cập nhật đúng sau khi đợi thêm');
        }
      }

      // Đợi message giỏ hàng trống
      const emptyMessage = await driver.wait(
        until.elementLocated(By.css('.empty-cart-message')),
        5000
      );
      const messageText = await emptyMessage.getText();

      if (messageText.includes('Giỏ hàng trống')) {
        console.log('✅ Message giỏ hàng trống hiển thị đúng');
        if (orderMsg && orderMsg.includes('Đặt hàng thành công')) {
          console.log('✅ Đặt hàng thành công và giỏ hàng đã được làm trống');
        }
      } else {
        console.log('FAIL - Message giỏ hàng trống không hiển thị đúng:', messageText);
      }
    } catch (e) {
      console.log('FAIL - Không thể kiểm tra trạng thái giỏ hàng trống:', e.message);
    }

  } finally {
    await driver.quit();
  }
}

runTest();
