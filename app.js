//Creates initial global variables that will be used throughout the functions
var ingredientsArray = [];
var foodCity;
var foodType;
var googleAPI="AIzaSyCQyeLt-vLwx27BDKm319Ls0Pn1dAvmThk";

//Initializes document before the JS begins running
$(document).ready(function () {

  // Initializes dropdown menu
  $('select').formSelect();

  //Hides submit buttons, Dine In, and Pickup options upon the page loading
  $("#restaraunt").hide();
  $("#foodInputs").hide();
  $("#foodInputsSubmit").hide();
  $("#functioningCard").hide();
  $("#using").hide();
  $("#instructions").hide();
  $("#pickUpSubmit").hide();
  $("#instructions2").hide();
  $("#going").hide();

  //Function that takes the response from the AJAX request and separates it into the necessary elements in order to create a card for each recipe.
  function getRecipes(x) {

    //Clears any previous content where the Recipes will be displayed
    $("#recipeList").empty();
    $("#recipeList2").empty();
    $("#recipeList3").empty();

    //Assigns the response results to a variable to be used by the function
    var mealResults = x.hits;

    //Cycles through all the results to separate them into their own columns. 
    for (i = 0; i < mealResults.length; i++) {
      if (i == 0 || i == 5) {
        var rCol = $("<div>").addClass("col s2 offset-s1");
      } else {
        var rCol = $("<div>").addClass("col s2");
      }
    //Adds a link to the Full Recipe on the image of the result
      var rImg = $("<img>").attr("src", mealResults[i].recipe.image);
      var linkUrl = mealResults[i].recipe.url;
      var rLink = $("<a>").attr("href", linkUrl).attr("target", "_blank");
      (rLink).append(rImg);
      var imgDiv = $("<div>").addClass("card-image").append(rLink);

    //Creates the contents of the card. Preparing the Title of the Recipe and passing the ingredient list to the proper function before appending the resulting list.
      var rTitle = $("<div>").addClass("card-title center pd10").text(mealResults[i].recipe.label)
      var rIng = mealResults[i].recipe.ingredientLines;
      var rlist = ingredientList(rIng);
      var rCard = $("<div>").addClass("card grey lighten-4 left")
    
    //Appends each card with the Image, Title and Ingredient list before appending it to the proper column
      rCard.append(imgDiv, rTitle, rlist);
      rCol.append(rCard);

    //Separates the columns into groups of 5 for aesthetic purposes
      if (i <= 4) {
        $("#recipeList").append(rCol);
      } else {
        $("#recipeList2").append(rCol);
      }
    }
  };

  // Event Listener that will initiate the Restaurant Search API function upon the user clicking Submit
  $("#submitTer").on("click", function (event) {
    event.preventDefault();

    foodType = $("#dropDown").val().trim();
    foodCity = $("#cityName").val().trim();
  
  //Makes sure the search isn't executed if there was nothing written in the search bar
    if(foodCity != "")
  {
  //Grabs the user's input and assigns them to the variables that will be used for the rest of the process.

    $("#instructions2").show()
    

  //Prepares the Query URL for the first AJAX call
   var apiKey = "273331ea460eeca63bfcf2af46d9a0c9";
   var cityURL = "https://developers.zomato.com/api/v2.1/cities?q=" + foodCity;
  
  //Makes an AJAX call to the Zomato API to get the requested city ID in order to then make the Restaurant Search
    $.ajax({
      url: cityURL,
      beforeSend: function(xhr){xhr.setRequestHeader('user-key', 
      apiKey);},  // This inserts the api key into the HTTP header
      method: "GET"
      
    }).then(function (response) {
    
    //After the initial response is returned, then the function makes a second API call in order to search for the requested restaurant type in that city
      getRestaurants(response, foodType);
  
    })
  }
  });

//Function that shows the restaurant search options and hides the recipe search options
  $("#pickUp").on("click", function () {
    $("#restaraunt").show();
    $("#foodInputs").hide();
    $("#foodInputsSubmit").hide();
    $("#instructions").hide();
    $("#eatIn").hide();
    $("#using").hide();
    $("#functioningCard").show();
    $("#pickUpSubmit").show()
    $("#going").show();
    $("#recipeList").empty();
    $("#recipeList2").empty();
    $("#recipeList3").empty();
    $("footer").removeClass("footerStart")
    $("#instructions2").hide()
  })

//Function that shows the restaurant search options and hides the recipe search options  
    $("#foodD").on("click", function () {
    $("#foodInputs").show();
    $("#restaraunt").hide();
    $("#instructions2").hide()
    $("#going").hide();
    $("#functioningCard").show();
    $("#using").show();
    $("#foodInputsSubmit").show();
    $("#pickUpSubmit").hide()
    $("#recipeList").empty();
    $("#recipeList2").empty();
    $("#recipeList3").empty();
    $("footer").removeClass("footerStart")
  })

//Function that takes the input from the "Ingredients" form and separates them, trims them and returns a variable to be inserted into the Query URL
  function ingSearch(p) {
    var separateIngs = p.split(",");
    var ingURL = "";
    for (var x = 0; x < separateIngs.length; x++) {
      if (x === 0) {
        ingURL = ingURL + "q=" + separateIngs[x];
      } else {
        ingURL = ingURL + "&" + "q=" + separateIngs[x];
      }
    }
    return ingURL;

  };

//Function that takes the input from the "Excluded" form and separates them, trims them and returns a variable to be inserted into the Query URL
  function exclSearch(q) {
    var separateExcl = q.split(",");
    var exclURL = "";
    for (var x = 0; x < separateExcl.length; x++) {
      if (x === 0) {
        exclURL = separateExcl[x];
      } else {
        exclURL = exclURL + "&" + "excluded=" + separateExcl[x];
      }
    }
    return exclURL;

  };

//Creates the Ingredients List based on the input for each recipe
  function ingredientList(a) {

    //Creates a div where all the ingredients will go
    var recipeText = $("<div>").addClass("fHeight");

    //Runs through every ingredient in the array in order to separate them into their own line/paragraph
    for (var x = 0; x < a.length; x++) {
      var ingText = $("<p>").text(a[x]);
      $(recipeText).append(ingText);
    }
    return recipeText;
  };

//Function that uses the City ID and the requested cuisine type in order to create an AJAX call to the Zomato API
  function getRestaurants(o,p) {
  
  //Obtains the first city id from the response, then combines that and the cuisine value to create the Query URL
    var cityID = o.location_suggestions[0].id;
    var resURL = "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityID + "&entity_type=city" + "&cuisines=" + p + "&count=9";
    var apiKey = "273331ea460eeca63bfcf2af46d9a0c9";

  //Makes an AJAX call to the Zomato API in order to get the restaurant list for that city
    $.ajax({
      url: resURL,
      beforeSend: function(xhr){xhr.setRequestHeader('user-key', 
      apiKey);},  // This inserts the api key into the HTTP header
      method: "GET"
      
    }).then(function (response) {
      
    //Waits for the response from the query to be returned before using it to call the Restaurant List function
      restList(response);
    })

  };

//Function that uses the response from the restaurant AJAX call to dynamically populate the restaurant list
  function restList(k)
  {
     //Clears any previous content in the area where the Restaurants will be displayed
     $("#recipeList").empty();
     $("#recipeList2").empty();
     $("#recipeList3").empty();

    //Assigns the Restaurants results to a variable that the function will use throughout the entire run
     var restResults = k.restaurants;
    
    //Cycles through all the results to create a column for each of their cards
    for (var i = 0; i < 9; i++) {
      
      var rCol = $("<div>").addClass("col s3 offset-s1");
   
      //Grabs the Restaurant name from the result array in the respective position
      var restName = restResults[i].restaurant.name;
      
      //Creates a list item with the Average User Review
      var restReview = $("<li>").text("Average User Review: " + restResults[i].restaurant.user_rating.aggregate_rating + "/5");
      
      //Creates the Price Range section before it will be appended
      var pRange = restResults[i].restaurant.price_range;
      var restRange = "";
       
      for(var x=1; x<=pRange; x++)
      {
       restRange = restRange + "$";
      }
      
      //The rest of the list elements are created before being appended to the card info section
       var costRange = $("<li>").text("Price Range: " + restRange);
       var avCost = $("<li>").text("Average Cost for Two: $" + restResults[i].restaurant.average_cost_for_two);
       var restLocation = $("<li>").text("Address: " + restResults[i].restaurant.location.address + "," + restResults[i].restaurant.location.city + "," + restResults[i].restaurant.location.zipcode);
       var menuUrl = restResults[i].restaurant.menu_url;
       var restCuisines = $("<li>").text("Cuisines: " + restResults[i].restaurant.cuisines);
       var rLink = $("<a>").attr({"href": menuUrl,"target":"_blank"}).text("See the Menu!");
       var menuLink = $("<li>").append(rLink);
       var infoList = $("<ul>").append(restReview, restCuisines, costRange, avCost, restLocation, menuLink);
       var restImg = restResults[i].restaurant.featured_image;

       var rCard = $("<div>").addClass("card left");
      
      //Checks if the restaurant info has a preview image. If not then it sets a placeholder image
       if(restImg != ""){
        var rImg = $("<img>").addClass("activator").attr("src", restImg);
       }else{
        var rImg = $("<img>").addClass("activator").attr("src", "food-placeholder.jpg");
       };
      
      //Creates the different sections of each card before appending them all together
       var imgDiv = $("<div>").addClass("card-image waves-effect waves-block waves-light").append(rImg);
       var rTitle = $("<span>").addClass("card-title activator center pd10").text(restName);
       var rTitle2 = $("<span>").addClass("card-title activator center pd10").text(restName);
       var rContent = $("<div>").addClass("card-content").append(rTitle2);
       rTitle2.append(infoList);
       var rReveal = $("<div>").addClass("card-reveal").append(rTitle2);
      
      //Puts together the card sections before appending the completed card to its respective column
       rCard.append(imgDiv, rTitle, rContent, rReveal);
       rCol.append(rCard);
      
      //Separates the columns into 3 rows for aesthetic reasons
      if (i <= 2) {
         $("#recipeList").append(rCol);
       } else if(i<=5) {
         $("#recipeList2").append(rCol);
       }else{
        $("#recipeList3").append(rCol);
       }
     }
   };

  //Creates an event listener that waits for the user to click the "Submit" button in order to begin the recipe search
  $("#submit").on("click", function (event) {

    //Prevents the listener to continue with a blank search
    event.preventDefault();

    //Runs the Ingredient and Exclution functions in order to make sure the values are inputted correctly
    var ingredient = ingSearch($("#include").val().trim());
    var exclude = exclSearch($("#exclude").val().trim());
    var foodURL = "";

    if (ingredient != "")
    {
    $("footer").removeClass("footerStart")
    //shows the instructions
    $("#instructions").show();

    //Creates a variable with the API Key and ID for the Edamam API
    var key = "app_key=3d809e0fa0e02efd9cc77818c1a35988";
    var id = "app_id=00bc6d9d";

    //Verifies if the "Excluded" field is empty or not. If it is then it just searches for ingredients. If it isn't empty then it adds the "excluded" ingredients to the search
    if (exclude != "") {
      foodURL = "https://api.edamam.com/search?" + id + "&" + key + "&" + ingredient + "&" + "excluded=" + exclude;
    } else {
      foodURL = "https://api.edamam.com/search?" + id + "&" + key + "&" + ingredient;
    }

    //Sends the AJAX request to the API with the complete URL
    $.ajax({
      url: foodURL,
      method: "GET"
      //Waits for the response to arrive before calling the getRecipes function in order to display the results
    }).then(function (response) {

      getRecipes(response);

    })

    //Clears the "Include" and "Exclude" forms getting ready for the next search
    $("#include").val("");
    $("#exclude").val("");
  }
  });

})

