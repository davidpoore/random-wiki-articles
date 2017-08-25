function fetchRandomImages() {
  // clear validation
  clearValidation();

  // get value from form field
  var numArticles = $('.Controls__numberInput').val();

  // validation
  if (numArticles === '' || parseInt(numArticles) <=0 || parseInt(numArticles) > 20) {
    $('.Controls__numberInput').addClass('Controls__numberInput--error');
    $('.Controls__errorMessage').css('display', 'block');
    return;
  }
  // empty previous articles
  $('.Articles').empty();

  // create request to fetch random image urls from wikipedia via wikimedia API
  var randomArticlesUrl =
    'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnlimit=' +
      numArticles +
        '&grnnamespace=0&prop=info|categories|extracts&inprop=url&exintro&explaintext&callback=?';

  // iterate over returned information and extract page data
  var allPagesInfo = [];

  $.getJSON(randomArticlesUrl, function(data) {
    Object.keys(data.query.pages).forEach(function(pageId) {
      var pageInfo = data.query.pages[pageId];

      var articleUrlElementStr = '<div class="Article__link"><a href="' + pageInfo.fullurl + '" target="_blank">Read More</a></div>';
      var articleTitleElementStr = '<div class="Article__titleSection"><span class="Article__title">' + pageInfo.title + '</span>' + articleUrlElementStr + '</div>';
      var articleSummaryElementStr = '<div class="Article__summary">' + pageInfo.extract + '</div>';
      var articleCategoriesElementStr = buildCategoriesElementStr(pageInfo.categories);

      // append images to page
      $('.Articles').append(
        '<div class="Article">' +
          articleTitleElementStr +
          '<br/>' +
          articleSummaryElementStr +
          articleCategoriesElementStr +
        '</div>'
      );
    });
  });
}

function buildCategoriesElementStr(categories) {
  var elementStr = '<div class="Article__categories"><div class="Article__categoriesTitle">Categories:</div>';

  if (categories) {
    elementStr += '<ul>';

    categories.forEach(function(category) {
      // strip leading 'Category:' from category title
      var categoryStr = category.title.substring(9);
      elementStr += '<li>' + categoryStr + '</li>';
    });

    elementStr += '</ul>';
  } else {
    elementStr += '<span class="Article__noCategories">No categories for article</span>';
  }

  elementStr += '</div>';
  return elementStr;
}

function clearValidation() {
  $('.Controls__errorMessage').css('display', 'none');
  $('.Controls__numberInput').removeClass('Controls__numberInput--error');
}
