package com.poly.service;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.dto.OrderDTO;
import com.poly.entity.Order;

public interface OrderService {
	Double getTotal();
	List<Order> getAllOrders();
	Order save(Order order);
	Order findById(Integer id);
	Order create(JsonNode orderData);
	List<Order> findAll();
//<<<<<<< Updated upstream
//	Order findById(Integer id);
	public List<Order> findByUsername(String username);
//=======
//>>>>>>> Stashed changes
//	Order save(OrderDTO orderDTO);
}
