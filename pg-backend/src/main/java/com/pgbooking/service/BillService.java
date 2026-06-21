package com.pgbooking.service;

import com.pgbooking.model.Bill;
import com.pgbooking.model.User;
import com.pgbooking.repository.BillRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public List<Bill> getBillsByUser(User user) {
        return billRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Bill createBill(double amount, String description, User user) {
        Bill bill = new Bill(amount, description, user);
        return billRepository.save(bill);
    }
}