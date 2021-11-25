const pti = require('puppeteer-to-istanbul');
const puppeteer = require('puppeteer');

let browser;
let page;

async function navigateTo(hash) {
    return Promise.all([
        await page.goto(`http://127.0.0.1:8000/#${hash}`, {waitUntil: 'networkidle2'})
    ]).catch(e => console.log(e));
}

async function getTextContent(query) {
    const handle = await page.$(query);
    const value = await page.evaluate(element => element.textContent, handle);
    handle.dispose();
    return value;
}

async function getInnerText(query) {
    const handle = await page.$(query);
    const value = await page.evaluate(element => element.innerHTML, handle);
    handle.dispose();
    return value;
}

async function getValues(query) {
    const handles = await page.$$(query);
    const values = [];

    for (let handle of handles) {
        values.push(await page.evaluate(element => element.value == null ? element.textContent : element.value, handle));
    }

    return values;
}

async function getValue(query) {
    const handle = await page.$(query);
    const value = await page.evaluate(element => element.value, handle);
    return value;
}

async function setValue(query, value) {
    const handle = await page.$(query);
    await page.evaluate((element, value) => element.value = value, handle, value);
}

async function setInputText(query, value) {
    const handle = await page.$(query);

    await handle.click({clickCount: 3});
    await page.keyboard.type(value);
    await page.keyboard.press("Tab");
}

async function hasAttribute(query, attrName) {
    const attr = await page.evaluate(`document.querySelector("${query}").getAttribute("${attrName}")`);
    return attr != null;
}

async function click(query) {
    const handle = await page.$(query);
    await handle.click();
}

async function isHidden(query) {
    const handle = await page.$(query);
    const value = await page.evaluate(element => element.getAttribute("hidden") != null, handle);
    return value;
}

async function childCount(query) {
    const handle = await page.$(query);
    const value = await page.evaluate(element => element.children.length, handle);
    return value;
}

async function countElements(query) {
    return await page.$$eval(query, elements => elements.length);
}

async function getAttributeValue(query, attrName) {
    return await page.evaluate(`document.querySelector("${query}").getAttribute("${attrName}")`);
}

async function getBindingPropertyValue(contextId, property) {
    const result = await page.evaluate(`window.crsbinding.data.getValue(${Number(contextId)}, "${property}")`);
    return result;
}

async function getSVGElementStoreSize() {
    return await page.evaluate("window.crsbinding.svgCustomElements._tagMap.size");
}

async function svgElementStoreBusy() {
    let isBusy = true;
    while (isBusy == true) {
        isBusy = await page.evaluate("window.crsbinding.svgCustomElements._queue.length > 0");
    }
}

beforeAll(async () => {
    jest.setTimeout(100000);
    browser = await puppeteer.launch({headless: false, slowMo: 10, args: ['--disable-dev-shm-usage', '--start-maximized']});
    page = await browser.newPage();
    await page.setViewport({
        width: 1366,
        height: 1366,
    });

    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
    ]);

    await page.goto('http://127.0.0.1:8000/#welcome', {waitUntil: 'networkidle2'});
});

afterAll(async () => {
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
    ]);
    pti.write([...jsCoverage, ...cssCoverage], { includeHostname: true , storagePath: './.nyc_output' });
    await page.close();
    browser.close();
});

test.skip("dom", async ()=> {
    await navigateTo("dom");
    await page.waitForSelector("button");

    Promise.all([
        await testDomCreation(),
        await testAttributes(),
        await testStyles(),
        await testTextContent(),
        await testWidget()
    ])
        .catch(error => throw new Error(error))
        .then(async () => {
            await page.goBack();
        })

})

async function testDomCreation() {
    expect(await childCount("#container")).toEqual(0);

    await click("#btnCreateElements");
    await page.waitForFunction('document.querySelector("#container").children.length > 0');
    expect(await childCount("#container")).toBeGreaterThan(0);

    await click("#btnClearElements");
    expect(await childCount("#container")).toEqual(0);
    await page.waitForFunction('document.querySelector("#container").children.length == 0');
}

async function testAttributes() {
    await click("#btnGetAttribute");
    await page.waitForFunction('document.querySelector("#edtAttr").value == "Hello World"');
    await setValue("#edtAttr", "Value 1");
}

async function testStyles() {
    await click("#btnGetStyle");
    await page.waitForFunction('document.querySelector("#edtStyle").value.length > 0');
    await setValue("#edtStyle", "red");
}

async function testTextContent() {
    await click("#btnGetText");
    await page.waitForFunction('document.querySelector("#edtText").value.length > 0');
    await setValue("#edtText", "Hello World");
    await click("#btnSetText");
}

async function testWidget() {
    await click("#btnGetWidget");
    await page.waitForFunction('document.querySelector("#widget").children.length > 0');
    await click("#btnClearWidget");
    await page.waitForFunction('document.querySelector("#widget").children.length == 0');
}