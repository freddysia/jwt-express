var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/person', function (req, res, next) {
  res.send([{
    IsSelected: 'aaaa',
    OfferSubmitted: 'G1'
  }, {
    IsSelected: 'bbbb',
    OfferSubmitted: 'G2'
  }]);
});

router.get('/users/:userId/books/:bookId', function (req, res, next) {
  res.send(req.params);
})
module.exports = router;

