var indexCart = 0;

var app = angular.module("myapp", []);
app.filter('dotDecimal', function() {
	return function(input) {
		return input.toString().replace(/,/g, '.');
	};
});
app.controller("myCtrl1", function($scope,$rootScope, $http) {
	$http.get(`/rest/account-role/security`).then(resp => {
		if (resp.data) {
			$auth = $rootScope.$auth = resp.data;
			$http.defaults.headers.common["Authorization"] = $auth.token;
		}
	});
	

	
	$http.get('/rest/products/list').then(function(response) {
		// Gán danh sách sản phẩm từ phản hồi API vào $scope.products
		$scope.products = response.data;
	});
	$http.get('/rest/category/list').then(function(response) {
		$scope.categorys = response.data;
	});
	$http.get('/rest/products/prodwithcate').then(function(response) {
		$scope.prodwcate = response.data;
	});
	$http.get('/rest/orders/list').then(function(response) {
		$scope.orders = response.data;
	});

	$scope.initialize = function() {
		$http.get('/rest/products/prodwithcate').then(function(response) {
			$scope.prodwcate = response.data;
		});
	}

	$scope.create = function() {

		var item = angular.copy($scope.form)
		var url = `/rest/products/create`;
		$http.post(url, item).then(function(response) {
			$scope.key = response.data.id;
			$scope.items[$scope.key] = item;
			alert("Thêm sản phẩm thành công!");
		}).then(function() {
			$('#add-pro').modal('hide');
			$scope.reset();
			$scope.initialize();
		}).catch(function(error) {
			// Xử lý lỗi nếu có
			alert("Lỗi khi thêm sản phẩm: " + error.message);
		});
	}
	
	$scope.update = function(){
		var item = angular.copy($scope.form);
		$http.put(`/rest/products/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			alert("Cập nhật sản phẩm thành công!");
		}).then(function() {
			$('#add-pro').modal('hide');
			$scope.reset();
			$scope.initialize();
		}).catch(error => {
			alert("Lỗi cập nhật sản phẩm!");
			console.log("Error", error);
		});
	}



	$scope.reset = function() {
		$scope.form = {
			image: "cloud-upload.jpg"
		}
	}
	$scope.imageChanged = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/images/product', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.image = resp.data.name;
		}).catch(error => {
			alert("Lỗi upload hình ảnh");
			console.log("Error", error);
		})
	}





	$scope.delete = function(key) {
		if (confirm("Bạn muốn xóa sản phẩm này?")) {
			$http.delete(`/rest/products/${key}`).then(resp => {
				delete $scope.items[key];
				alert("Xóa sản phẩm thành công!");
				$scope.initialize();
			}).catch(error => {
				alert("Lỗi xóa sản phẩm!");
				console.log("Error", error);
			});
		}
	};

	$scope.initialize();



	$scope.edit = function(key) {
		var url = `/rest/products/${key}`;
		$http.get(url).then(function(response) {
			$scope.form = response.data;
			$scope.key = key;
		})
	}


	$scope.addCart = function(id) {
		var item = this.items.find(item => item.id == id);

		if (item) {
			item.quantity += 1;
			this.saveToLocalStorage();
		} else {
			$http.get(`/rest/products/${id}`).then(resp => {
				resp.data.quantity = 1;
				this.items.push(resp.data);
				this.saveToLocalStorage();
			});
		}
	};
	
	$scope.saveToLocalStorage = function() {
		var json = JSON.stringify(angular.copy($scope.items));
		localStorage.setItem("cart", json);
	};

	$scope.loadFormLocalStorage = function() {
		var json = localStorage.getItem("cart");
		this.items = json ? JSON.parse(json) : [];
	};

	$scope.removeCart = function(id) {
		var index = $scope.items.findIndex(item => item.id === id);
		if (index !== -1) {
			$scope.items.splice(index, 1);
			$scope.saveToLocalStorage();
		}
	};

	$scope.addClick = function(id) {
		var item = this.items.find(item => item.id == id);

		if (item) {
			item.quantity += 1;
			this.saveToLocalStorage();
		}
		/*if (typeof $rootScope.cart != 'undefined') {
			$rootScope.sumMoney = 0;
			for (var i = 0; i < $rootScope.cart.length; i++) {
				$rootScope.sumMoney = $rootScope.sumMoney + $rootScope.cart[i].quantity * $rootScope.cart[i].price;
			}
		}*/
	}
	$scope.clear = function() {
		$scope.items = []
		$scope.saveToLocalStorage();
	};

	$scope.amount = function() {
		return this.items
			.map(item => item.quantity * item.price)
			.reduce((total, quantity) => total += quantity, 0);
	}

	$scope.createOrderAndDetails = function() {
		var status = ($scope.orderData.paymentMethod === 'Cash') ? 'false' : 'true';

		var orderData = {
			account: $auth.user.username,
			createDate: new Date(),
			total: $scope.amount(),
			status: status,
			address: $scope.orderData.address,
			orderDetail: $scope.items.map(item => {
				return {
					product: item.id,
					price: item.price,
					quantity: item.quantity
				};
			})
		};
		if ($scope.items == null || $scope.items.length == 0) {
			alert("Không có hàng để đặt!");
			window.location.href = '/';
			return;
		}
		$http.post("/rest/orders", orderData).then(resp => {
			// Xử lý sau khi đặt hàng thành công, ví dụ như chuyển hướng đến trang thành công
			alert("Đặt hàng thành công!");
			// Đặt giỏ hàng thành rỗng sau khi đặt hàng thành công
			$scope.clear();
			window.location.href = '/';
			// Điều hướng đến trang thành công hoặc trang xác nhận đơn hàng
			// window.location.href = "/success";
		}).catch(error => {
			alert("Đặt hàng lỗi!");
			console.log(error);
		});
	};


	$scope.subClick = function(id) {
		var item = this.items.find(item => item.id == id);

		if (item.quantity > 1) {
			item.quantity -= 1;
			this.saveToLocalStorage();
		}
		/*if (typeof $rootScope.cart != 'undefined') {
			$rootScope.sumMoney = 0;
			for (var i = 0; i < $rootScope.cart.length; i++) {
				$rootScope.sumMoney = $rootScope.sumMoney + $rootScope.cart[i].quantity * $rootScope.cart[i].price;
			}
		}*/
	}

	$scope.count = function() {
		return this.items.length;
	}

	$scope.editorder = function(key) {
		var url = `/rest/orders/${key}`;
		$http.get(url).then(function(response) {
			$scope.form = response.data;
			$scope.key = key;
		})
	}
	
	$scope.updateorder = function(){
		var item = angular.copy($scope.form);
		$http.put(`/rest/orders/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			alert("Cập nhật thành công!");
		})
	.then(function() {
			$('#edit-order').modal('hide');
			location.reload();

		}).catch(error => {
			alert("Lỗi cập nhật sản phẩm!");
			console.log("Error", error);
		});
	}
	
	$scope.initialize1 = function() {
		$http.get('/rest/orders/list').then(function(response) {
			$scope.orders = response.data;
		})
			$http.get('/rest/account/list').then(function(response) {
		$scope.accounts = response.data;
		});
	}
	$scope.initialize();

	// Khởi tạo giỏ hàng từ Local Storage khi trang tải
	$scope.items = JSON.parse(localStorage.getItem("cart")) || [];

	/*$scope.cart = {
		items: [],
		
		//Thêm sản phẩm vào giỏ hàng
		addCart(id) {
			var item = this.items.find(item => item.id == id);

			if (item) {
				item.quantity += 1;
				this.saveToLocalStorage();
			} else {
				$http.get(`/rest/products/${id}`).then(resp => {
					resp.data.quantity = 1;
					this.items.push(resp.data);
					this.saveToLocalStorage();

				})
			}

		},
		
	
	
	
	saveToLocalStorage(){
		var json = JSON.stringify(angular.copy(this.items));
		localStorage.setItem("cart",json);	
	},
	
	
	}*/
});


/*//Nhấn nút Cộng để thêm sản phẩm
$scope.addClick = function(index) {
	$rootScope.cart[index].quantity = $rootScope.cart[index].quantity + 1;
	if (typeof $rootScope.cart != 'undefined') {
		$rootScope.sumMoney = 0;
		for (var i = 0; i < $rootScope.cart.length; i++) {
			$rootScope.sumMoney = $rootScope.sumMoney + $rootScope.cart[i].quantity * $rootScope.cart[i].price;
		}
	}
}
//trừ
$scope.subClick = function(index) {
	if ($rootScope.cart[index].quantity > 1) {
		$rootScope.cart[index].quantity = $rootScope.cart[index].quantity - 1;
	}
	if (typeof $rootScope.cart != 'undefined') {
		$rootScope.sumMoney = 0;
		for (var i = 0; i < $rootScope.cart.length; i++) {
			$rootScope.sumMoney = $rootScope.sumMoney + $rootScope.cart[i].quantity * $rootScope.cart[i].price;
		}
	}
}
//Xóa sản phẩm trong giỏ hàng
$scope.delProduct = function(index) {
	$rootScope.cart.splice(index, 1);
	if (typeof $rootScope.cart != 'undefined') {
		$rootScope.sumMoney = 0;
		for (var i = 0; i < $rootScope.cart.length; i++) {
			$rootScope.sumMoney = $rootScope.sumMoney + $rootScope.cart[i].quantity * $rootScope.cart[i].price;
		}
	}
}
$scope.products = [];
$http.get("sanpham.json").then(function(response) {
	$scope.products = response.data;
});


$scope.index = $routeParams.url;
$scope.limit = 10;
$scope.loadMore = function() {
	$scope.limit += 20;

}
$scope.showless = function() {
	$scope.limit = 10;
}
$scope.scrollToTop = function() {
	window.scrollTo(0, 0);
}


});*/