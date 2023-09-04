package com.poly.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poly.dao.AccountDao;
import com.poly.dao.OrderDao;
import com.poly.dao.OrderDetailDao;
import com.poly.dao.ProductDAO;
import com.poly.dto.OrderDTO;
import com.poly.dto.ProductDTO;
import com.poly.entity.Account;
import com.poly.entity.Category;
import com.poly.entity.Order;
import com.poly.entity.OrderDetail;
import com.poly.entity.Product;
import com.poly.service.OrderService;
@Service
public class OrderServiceImpl implements OrderService{
	@Autowired
	OrderDao ordDao;

	@Autowired
	AccountDao accountDao;

	@Autowired
	ProductDAO productDAO;

	@Autowired
	OrderDetailDao orderDetailDao;
	
	
	
	@Override
	public Double getTotal() {
		return ordDao.getTotal();
	}

	@Override
	public List<Order> getAllOrders() {
		// TODO Auto-generated method stub
		return ordDao.findAll();
	}

	@Override
	public Order save(Order order) {
		// TODO Auto-generated method stub
		/*
		 * Order order1 = new Order(); order1.setAccount(order1.getAccount());
		 * order1.setCreateDate(order1.getCreateDate());
		 * order1.setOrderDetail(order1.getOrderDetail());
		 * order1.setAddress(order1.getAddress()); order1.setId(order1.getId());
		 * order1.setStatus(order1.getStatus()); order1.setTotal(order1.getTotal());
		 */
		return ordDao.save(order);
	}
	
	/*
	 * @Override public Order save(OrderDTO orderDTO) { // TODO Auto-generated
	 * method stub Order order = new Order();
	 * order.setAccount(orderDTO.getAccount());
	 * order.setCreateDate(orderDTO.getCreateDate());
	 * order.setOrderDetail(orderDTO.getOrderDetail());
	 * order.setAddress(orderDTO.getAddress()); order.setId(orderDTO.getId());
	 * order.setStatus(orderDTO.getStatus()); order.setTotal(orderDTO.getTotal());
	 * return ordDao.save(order); }
	 */
		

	@Override
	public Order create(JsonNode orderData) {
		// TODO Auto-generated method stub
		ObjectMapper mapper = new ObjectMapper();
        String username = orderData.get("account").asText();

        Account account = accountDao.findByUsername(username);

        Order order = mapper.convertValue(orderData, Order.class);
        order.setAccount(account);
        ordDao.save(order);
        List<OrderDetail> details = new ArrayList<>();
        JsonNode orderDetailsNode = orderData.get("orderDetail");
        if (orderDetailsNode != null && orderDetailsNode.isArray()) {
            for (JsonNode detailNode : orderDetailsNode) {
                OrderDetail detail = mapper.convertValue(detailNode, OrderDetail.class);
                Product product = productDAO.findById(detailNode.get("product").asInt()).orElse(null);
                detail.setOrder(order);
                if (product != null) {
                    detail.setProduct(product);
                    details.add(detail);
                }
            }
        }
        orderDetailDao.saveAll(details);
        return order;
	}
//<<<<<<< Updated upstream
//	@Override
//	public List<Order> findAll() {
//		return ordDao.findAll();
//	}

//	@Override
//	public Order findById(Integer id) {
//=======

	@Override
	public Order findById(Integer id) {
		// TODO Auto-generated method stub
//>>>>>>> Stashed changes
		return ordDao.findById(id).get();
	}

	@Override
//<<<<<<< Updated upstream
//	public List<Order> findByUsername(String username) {
//		return ordDao.findByUsername(username);
//	}
//=======
	public List<Order> findAll() {
		// TODO Auto-generated method stub	
		return ordDao.findAll();
	}

	@Override
	public List<Order> findByUsername(String username) {
		return ordDao.findByUsername(username);
	}

	
//>>>>>>> Stashed changes
	
}
