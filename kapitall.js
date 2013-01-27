var Companies = [
  {
      name : 'Apple'
    , symbol : 'AAPL'
    , price : '577'
  },
  
  {
      name: 'Google'
    , symbol : 'GOOG'
    , price : '650'
  },
  
  {
      name : 'JP Morgan Chase'
    , symbol : 'JPM'
    , price : '33'
  },
  
  {
      name : 'Microsoft'
    , symbol : 'MSFT'
    , price : '35'
  },
  
  {
      name : 'Facebook'
    , symbol : 'FB'
    , price : '27'
  }
];

var iPortfolioTotal;
var iPortfolioCash = 1000.00;
var aPortfolio = [];
var aStockList = [];

$(function() {
  Initialize();

  // Simulate Market Price Changes
  setInterval(function() {
    for (i in Companies) {

      // Randomize Number between 0 and 20, divide by 100, subtract by 0.1 
      // Range: -0.1 to 0.1
      fRandomChange = (Math.floor(Math.random() * 20)/100)-0.1;

      // Calculate new price and set it
      fPrice = (parseFloat(Companies[i].price) + fRandomChange).toFixed(2);
      Companies[i].price = fPrice;

      //  Update values in markup
      $("#"+Companies[i].symbol+" .name").html(Companies[i].name);
      $("#"+Companies[i].symbol+" .symbol").html(Companies[i].symbol);
      $("#"+Companies[i].symbol+" .price").html(fPrice);
    }
    // UpdatePortfolioValue();
    // ShowPortfolioCash();
  }, 1000);  

  for (var i = 0; i < aStockList.length; i++ ) {
    (function(stock_symbol) {

      // If user clicks "Buy" button
      $("#"+stock_symbol+" .buy").click(function(){
        if (EnoughCashToBuy(stock_symbol,1)) {
          UpdatePortfolioShares(stock_symbol,1);
          UpdatePortfolioCash(stock_symbol,-1);
          UpdatePortfolioValue();
        }
        UpdateButtons();
      });

      // If user clicks "Sell" button
      $("#"+stock_symbol+" .sell").click(function(){
        if (EnoughSharesToSell(stock_symbol,1)) {
          UpdatePortfolioShares(stock_symbol,-1);
          UpdatePortfolioCash(stock_symbol,1);
          UpdatePortfolioValue();
        }
        UpdateButtons();
      });

    })(aStockList[i]);
  }
});


function Initialize() {
  for (i in Companies) {
    // Set Initial Qty For Stock in aPortfolio to 0
    hCompanyInit = {};  
    sSymbol = Companies[i].symbol;
    hCompanyInit[sSymbol] = 0;
    aPortfolio.push(hCompanyInit);

    // Update markup with initial name, symbol, price
    $("#"+Companies[i].symbol+" .name").html(Companies[i].name);
    $("#"+Companies[i].symbol+" .symbol").html(Companies[i].symbol);
    $("#"+Companies[i].symbol+" .price").html(Companies[i].price);
  }

  // Update markup with initial qty_owned
  for (i in aPortfolio) {
    oStockOwned = aPortfolio[i];

    for (stock_symbol in oStockOwned) {
      aStockList.push(stock_symbol);
      $("#"+stock_symbol+" .qty_owned span").html(oStockOwned[stock_symbol]);
    }
  }
  UpdatePortfolioValue();
  ShowPortfolioCash();
  UpdateButtons();
}

// Return true if there is enough cash to buy shares of stock
function EnoughCashToBuy(stock_symbol, qty_shares) {
  price = CompanyPrice(stock_symbol);
  cost = qty_shares * price;
  cash = iPortfolioCash;

  if (cash >= cost) {
    return true;
  } else {
    return false;
  }
}

// Return true if there are enough shares of stock to sell
function EnoughSharesToSell(stock_symbol, qty_shares) {
  total_shares = PortfolioShares(stock_symbol);

  if (total_shares >= qty_shares) {
    return true;
  } else {
    return false;
  }
}

// Return the quantity of stock owned
function PortfolioShares(stock_symbol) {
  for (var i = 0; i < aPortfolio.length; i++ ) {
    oQtyStockOwned = aPortfolio[i];

    j = Object.keys(oQtyStockOwned)[0];
    if (stock_symbol == j) {
      return oQtyStockOwned[j];
    }
  }      
}

// Update the quantity of stock owned and change the markup
function UpdatePortfolioShares(stock_symbol, qty_shares) {
  for (var i = 0; i < aPortfolio.length; i++ ) {
    oQtyStockOwned = aPortfolio[i];

    j = Object.keys(oQtyStockOwned)[0];
    if (stock_symbol == j) {
      new_qty_owned = oQtyStockOwned[j] + qty_shares;
      oQtyStockOwned[j] = new_qty_owned
      $("#"+stock_symbol+" .qty_owned span").html(new_qty_owned);
    }
  }      
}

// Return the stock price
function CompanyPrice(stock_symbol) {
  for (i in Companies) {
    if ( Companies[i].symbol == stock_symbol ) {
      price = Companies[i].price;
      return price;
    }
  }
}

// Update the portfolio cash value
function UpdatePortfolioCash(stock_symbol, qty_shares) {
  price = CompanyPrice(stock_symbol);
  stock_total = price * qty_shares;

  iPortfolioCash = iPortfolioCash + stock_total;
  cash_total = iPortfolioCash.toFixed(2);
  $("#panel-header .portfolio-cash").html("Available Cash: "+cash_total);

}

// Update the portfolio cash value in markup
function ShowPortfolioCash() {
  cash_total = iPortfolioCash.toFixed(2);
  $("#panel-header .portfolio-cash").html("Available Cash: "+cash_total);
}

// Calculate the Portfolio Total Value
// Cash + (price * qty_owned of each stock)
function PortfolioValue() {
  cash = iPortfolioCash;
  total = parseFloat(cash);

  for (var i = 0; i < aStockList.length; i++ ) {
    (function(stock_symbol) {
      qty_owned = PortfolioShares(stock_symbol);
      price = CompanyPrice(stock_symbol);

      stock_total = price * qty_owned;
      total = total + stock_total;
    })(aStockList[i]);
  }
  return total;
}

// Update the Portfolio Value and change the markup
function UpdatePortfolioValue() {
  portfolio_total = PortfolioValue().toFixed(2);

  $("#panel-header .portfolio-value").html("Portfolio Value: "+portfolio_total);
}

function UpdateButtons() {
  for (var i = 0; i < aStockList.length; i++ ) {
    (function(stock_symbol) {
      if (EnoughCashToBuy(stock_symbol,1)) {
        $("#"+stock_symbol+" .buy").fadeIn();
      }

      if (!EnoughCashToBuy(stock_symbol,1)) {
        $("#"+stock_symbol+" .buy").hide();
      }

      if (EnoughSharesToSell(stock_symbol,1)) {
        $("#"+stock_symbol+" .sell").fadeIn();        
      }

      if (!EnoughSharesToSell(stock_symbol,1)) {
        $("#"+stock_symbol+" .sell").hide();        
      }      
    })(aStockList[i]);
  }
}