package com.futureschool.backend.controller;

import com.futureschool.backend.entity.FeeTransaction;
import com.futureschool.backend.entity.Student;
import com.futureschool.backend.service.FeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
@Tag(name = "Finance & Fees", description = "Endpoints for collecting fees, generating receipts, and tracking balances")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @PostMapping("/collect")
    @Operation(summary = "Collect fee from student and generate official receipt")
    public ResponseEntity<?> collectFee(@RequestBody FeeTransaction tx) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String collector = (auth != null) ? auth.getName() : "Cashier";
            FeeTransaction saved = feeService.collectFee(tx, collector);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/transactions")
    @Operation(summary = "List all fee payment transactions")
    public ResponseEntity<List<FeeTransaction>> getAllTransactions() {
        return ResponseEntity.ok(feeService.getAllTransactions());
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get fee payment history for a specific student")
    public ResponseEntity<List<FeeTransaction>> getStudentTransactions(@PathVariable String studentId) {
        return ResponseEntity.ok(feeService.getStudentTransactions(studentId));
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get all students with pending / overdue fee balances")
    public ResponseEntity<List<Student>> getOverdueStudents() {
        return ResponseEntity.ok(feeService.getOverdueStudents());
    }

    @PostMapping("/assign")
    @Operation(summary = "Assign / invoice fee amount to a student")
    public ResponseEntity<?> assignFee(@RequestBody Map<String, Object> body) {
        try {
            String studentId = (String) body.get("studentId");
            Double amount = Double.valueOf(body.get("amount").toString());
            return ResponseEntity.ok(feeService.assignFee(studentId, amount));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
