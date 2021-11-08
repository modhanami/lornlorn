"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createUserCart = createUserCart;
var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));
var _cartItem = require("./CartItem");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function createUserCart(user, cart) {
    return {
        user: user,
        cart: cart,
        addToCart: function(product, quantity) {
            return _asyncToGenerator(_regeneratorRuntime.default.mark(function _callee() {
                var cartItem;
                return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            if (!(quantity <= 0)) {
                                _ctx.next = 2;
                                break;
                            }
                            throw new Error("Quantity must be greater than 0");
                        case 2:
                            cartItem = cart.items.find(function(item) {
                                return item.product.name === product.name;
                            });
                            if (cartItem) {
                                cartItem.quantity += quantity;
                            } else {
                                cart.addItem((0, _cartItem).createCartItem(product, quantity));
                            }
                        case 4:
                        case "end":
                            return _ctx.stop();
                    }
                }, _callee);
            }))();
        }
    };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdHkvVXNlckNhcnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FydCB9IGZyb20gXCIuL0NhcnRcIjtcclxuaW1wb3J0IHsgY3JlYXRlQ2FydEl0ZW0gfSBmcm9tIFwiLi9DYXJ0SXRlbVwiO1xyXG5pbXBvcnQgeyBQcm9kdWN0IH0gZnJvbSBcIi4vUHJvZHVjdFwiO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4vdXNlclwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBVc2VyQ2FydCB7XHJcbiAgaWQ/OiBudW1iZXI7XHJcbiAgdXNlcjogVXNlcjtcclxuICBjYXJ0OiBDYXJ0O1xyXG4gIGFkZFRvQ2FydChwcm9kdWN0OiBQcm9kdWN0LCBxdWFudGl0eTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVzZXJDYXJ0KHVzZXI6IFVzZXIsIGNhcnQ6IENhcnQpOiBVc2VyQ2FydCB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHVzZXIsXHJcbiAgICBjYXJ0LFxyXG4gICAgYXN5bmMgYWRkVG9DYXJ0KHByb2R1Y3Q6IFByb2R1Y3QsIHF1YW50aXR5OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgaWYgKHF1YW50aXR5IDw9IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJRdWFudGl0eSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBjYXJ0SXRlbSA9IGNhcnQuaXRlbXMuZmluZChcclxuICAgICAgICAoaXRlbSkgPT4gaXRlbS5wcm9kdWN0Lm5hbWUgPT09IHByb2R1Y3QubmFtZVxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGNhcnRJdGVtKSB7XHJcbiAgICAgICAgY2FydEl0ZW0ucXVhbnRpdHkgKz0gcXVhbnRpdHk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FydC5hZGRJdGVtKGNyZWF0ZUNhcnRJdGVtKHByb2R1Y3QsIHF1YW50aXR5KSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG4iXSwibmFtZXMiOlsiY3JlYXRlVXNlckNhcnQiLCJ1c2VyIiwiY2FydCIsImFkZFRvQ2FydCIsInByb2R1Y3QiLCJxdWFudGl0eSIsImNhcnRJdGVtIiwiRXJyb3IiLCJpdGVtcyIsImZpbmQiLCJpdGVtIiwibmFtZSIsImFkZEl0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7UUFZZ0JBLGNBQWMsR0FBZEEsY0FBYzs7QUFYQyxHQUFZLENBQVosU0FBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FXM0JBLGNBQWMsQ0FBQ0MsSUFBVSxFQUFFQyxJQUFVLEVBQVksQ0FBQztJQUNoRSxNQUFNLENBQUMsQ0FBQztRQUNORCxJQUFJLEVBQUpBLElBQUk7UUFDSkMsSUFBSSxFQUFKQSxJQUFJO1FBQ0VDLFNBQVMsV0FBQ0MsT0FBZ0IsRUFBRUMsUUFBZ0I7c0VBQWxELFFBQVEsV0FBMkQsQ0FBQztvQkFLNURDLFFBQVE7Ozs7a0NBSlZELFFBQVEsSUFBSSxDQUFDOzs7OzRCQUNmLEtBQUssQ0FBQyxHQUFHLENBQUNFLEtBQUssQ0FBQyxDQUFpQzs7NEJBRzdDRCxRQUFRLEdBQUdKLElBQUksQ0FBQ00sS0FBSyxDQUFDQyxJQUFJLENBQzlCLFFBQVEsQ0FBUEMsSUFBSTtnQ0FBS0EsTUFBTSxDQUFOQSxJQUFJLENBQUNOLE9BQU8sQ0FBQ08sSUFBSSxLQUFLUCxPQUFPLENBQUNPLElBQUk7OzRCQUc5QyxFQUFFLEVBQUVMLFFBQVEsRUFBRSxDQUFDO2dDQUNiQSxRQUFRLENBQUNELFFBQVEsSUFBSUEsUUFBUTs0QkFDL0IsQ0FBQyxNQUFNLENBQUM7Z0NBQ05ILElBQUksQ0FBQ1UsT0FBTyxLQTNCVyxTQUFZLGlCQTJCUFIsT0FBTyxFQUFFQyxRQUFROzRCQUMvQyxDQUFDOzs7Ozs7WUFDSCxDQUFDOztJQUNILENBQUM7QUFDSCxDQUFDIn0=