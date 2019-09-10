const puppeteer = require("puppeteer");
const args = require("args");
var moment = require("moment");
const fs = require("fs-extra");

args.option("headless", "Run headless");

const { headless } = args.parse(process.argv);

const start = async () => {
  console.log("Starting script...");

  let hdl = false;
  if (typeof headless != "undefined") {
    hdl = true;
  }
  const browser = await puppeteer.launch({
    headless: hdl,
    devtools: false,
    defaultViewport: null
  });
  // const browser = await puppeteer.launch();
  const endpoint = browser.wsEndpoint();
  await fs.writeJSON("./runinfo.json", { endpoint });
  const page = (await browser.pages())[0];
  await page.goto(
    "https://www.uka.no/program/391-silent-disco-club-til-dodens-dal/497/billetter",
    {
      waitUntil: "networkidle2"
    }
  );
  
  const tryit = async () => {
    if ((await page.$(".ticket-group-container")) !== null) {

      // await page.$eval(".ticket-group-container", node => {
      //   console.log("node: ", node);
      //   console.log(node.querySelectorAll("tr"));
      //   const rows = Array.from(node.querySelectorAll("tr"));
    
      //   rows.forEach(r => {
      //     if (r.children[0].innerHTML == "Medlem") {
      //       console.log();
      //       r.children[2].children[0].value = 9;
      //     }
    
      //     if (r.children[0].innerHTML == "Ikke-medlem") {
      //       console.log();
      //       r.children[2].children[0].value = 2;
      //     }
      //   });
      // });


      await page.$$eval("select", nodes => {
        console.log('nodes: ', nodes);
        nodes[0].value = 1;
        nodes[1].value = 9;
      });
    
      await page.$eval("input[type=email]", node => {
        node.value = "mail@larskarbo.no"; //epost
      });
    
      await page.$eval("input[placeholder=betalingskortnummer]", node => {
        node.value = "1234123412341234"; //kredittkortnummer
      });
    
      await page.$eval("select[autocomplete=cc-exp-month]", node => {
        node.value = "01"; //mnd
      });
    
      await page.$eval("select[autocomplete=cc-exp-year]", node => {
        node.value = "20"; //år
      });
    
      await page.$eval("input[autocomplete=cc-csc]", node => {
        node.value = "222"; //cvc
      });
    
      await page.$eval("input[type=submit]", node => {
        node.click()
      });
    } else {
      console.log('not found')
      await page.reload({
        waitUntil: "networkidle2"
      })
      tryit();
    }
  }

  tryit()
  
  

  return;

  await page.$("input[type=email]").then(e => {
    return e.type("mail@larskarbo.no");
  });
  await page
    .$("input[type=password]")
    .then(e => e.type(process.env.TRUECOACH_PASSWORD));
  await page.$("button[type=submit]").then(e => e.click());
  await page.waitForNavigation({ waitUntil: "networkidle0" });
};

const yo = async () => {
  console.log("hey");
  const runinfo = await fs.readJSON("./runinfo.json");
  const browser = await puppeteer.connect({
    browserWSEndpoint: runinfo.endpoint
  });
  const page = (await browser.pages())[0];
  // --------------
};
start();

// yo()
