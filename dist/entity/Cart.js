"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createCart = createCart;
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
function createCart() {
    var _items = [];
    var cart = {
        items: _items,
        getTotal: function() {
            return _items.reduce(function(acc, item) {
                return acc + item.getTotal();
            }, 0);
        },
        addItem: function(item) {
            _items.push(item);
        },
        addItems: function() {
            for(var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++){
                items[_key] = arguments[_key];
            }
            var __items;
            (__items = _items).push.apply(__items, _toConsumableArray(items));
        }
    };
    return cart;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdHkvQ2FydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXJ0SXRlbSB9IGZyb20gXCIuL0NhcnRJdGVtXCI7XHJcbmltcG9ydCB7IFByb2R1Y3QgfSBmcm9tIFwiLi9Qcm9kdWN0XCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhcnQge1xyXG4gIGlkPzogbnVtYmVyO1xyXG4gIGl0ZW1zOiBDYXJ0SXRlbVtdO1xyXG4gIGdldFRvdGFsKCk6IG51bWJlcjtcclxuICBhZGRJdGVtKGl0ZW06IENhcnRJdGVtKTogdm9pZDtcclxuICBhZGRJdGVtcyguLi5pdGVtOiBDYXJ0SXRlbVtdKTogdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNhcnQoKTogQ2FydCB7XHJcbiAgY29uc3QgX2l0ZW1zOiBDYXJ0SXRlbVtdID0gW107XHJcbiAgY29uc3QgY2FydDogQ2FydCA9IHtcclxuICAgIGl0ZW1zOiBfaXRlbXMsXHJcbiAgICBnZXRUb3RhbCgpIHtcclxuICAgICAgcmV0dXJuIF9pdGVtcy5yZWR1Y2UoKGFjYywgaXRlbSkgPT4gYWNjICsgaXRlbS5nZXRUb3RhbCgpLCAwKTtcclxuICAgIH0sXHJcbiAgICBhZGRJdGVtKGl0ZW06IENhcnRJdGVtKSB7XHJcbiAgICAgIF9pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgfSxcclxuICAgIGFkZEl0ZW1zKC4uLml0ZW1zOiBDYXJ0SXRlbVtdKSB7XHJcbiAgICAgIF9pdGVtcy5wdXNoKC4uLml0ZW1zKTtcclxuICAgIH0sXHJcbiAgfTtcclxuICByZXR1cm4gY2FydDtcclxufVxyXG4iXSwibmFtZXMiOlsiY3JlYXRlQ2FydCIsIl9pdGVtcyIsImNhcnQiLCJpdGVtcyIsImdldFRvdGFsIiwicmVkdWNlIiwiYWNjIiwiaXRlbSIsImFkZEl0ZW0iLCJwdXNoIiwiYWRkSXRlbXMiXSwibWFwcGluZ3MiOiI7Ozs7UUFXZ0JBLFVBQVUsR0FBVkEsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1NBQVZBLFVBQVUsR0FBUyxDQUFDO0lBQ2xDLEdBQUssQ0FBQ0MsTUFBTSxHQUFlLENBQUMsQ0FBQztJQUM3QixHQUFLLENBQUNDLElBQUksR0FBUyxDQUFDO1FBQ2xCQyxLQUFLLEVBQUVGLE1BQU07UUFDYkcsUUFBUSxFQUFSQSxRQUFRLEdBQUcsQ0FBQztZQUNWLE1BQU0sQ0FBQ0gsTUFBTSxDQUFDSSxNQUFNLENBQUMsUUFBUSxDQUFQQyxHQUFHLEVBQUVDLElBQUk7Z0JBQUtELE1BQU1DLENBQU5ELEdBQUcsR0FBR0MsSUFBSSxDQUFDSCxRQUFRO2VBQUksQ0FBQztRQUM5RCxDQUFDO1FBQ0RJLE9BQU8sRUFBUEEsUUFBUUQsQ0FBQUEsSUFBYyxFQUFFLENBQUM7WUFDdkJOLE1BQU0sQ0FBQ1EsSUFBSSxDQUFDRixJQUFJO1FBQ2xCLENBQUM7UUFDREcsUUFBUSxFQUFSQSxRQUFRLEdBQXVCLENBQUM7WUFBdkIsR0FBR1AsQ0FBSCxHQUFTLENBQVQsSUFBb0IsR0FBcEIsU0FBb0IsQ0FBcEIsTUFBb0IsRUFBakJBLEtBQUssR0FBUixHQUFTLE9BQVQsSUFBb0IsR0FBcEIsSUFBb0IsR0FBcEIsQ0FBb0IsRUFBcEIsSUFBb0IsR0FBcEIsSUFBb0IsRUFBcEIsSUFBb0IsR0FBcEIsQ0FBQztnQkFBRUEsS0FBSyxDQUFSLElBQW9CLElBQXBCLFNBQW9CLENBQXBCLElBQW9CO1lBQUQsQ0FBQztnQkFDM0JGLE9BQU07YUFBTkEsT0FBTSxHQUFOQSxNQUFNLEVBQUNRLElBQUksQ0FBWFIsS0FBcUIsQ0FBckJBLE9BQU0scUJBQVNFLEtBQUs7UUFDdEIsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUNELElBQUk7QUFDYixDQUFDIn0=