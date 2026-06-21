package com.pgbooking.web;

import com.pgbooking.model.Bill;
import com.pgbooking.model.User;
import com.pgbooking.service.BillService;
import com.pgbooking.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBills() {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));
        List<Bill> bills = billService.getBillsByUser(user);
        return ResponseEntity.ok(bills);
    }
}