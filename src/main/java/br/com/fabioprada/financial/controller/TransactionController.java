package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.model.Transaction;
import br.com.fabioprada.financial.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public List<Transaction> listAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String transactionType
    ) {
        return transactionService.searchTransactions(name, startDate, endDate, categoryId, transactionType);
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction transaction) {
        return transactionService.save(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updated(@PathVariable Long id, @RequestBody Transaction transactionDetails) {
        return transactionService.findByIdAndUserId(id)
                .map(transaction -> {
                    transaction.setName(transactionDetails.getName());
                    transaction.setAmount(transactionDetails.getAmount());
                    transaction.setCreationDate(transactionDetails.getCreationDate());
                    transaction.setTransactionType(transactionDetails.getTransactionType());
                    transaction.setCategory(transactionDetails.getCategory());
                    transaction.setOutAccount(transactionDetails.getOutAccount());
                    transaction.setInAccount(transactionDetails.getInAccount());
                    Transaction updated = transactionService.save(transaction);
                    return ResponseEntity.ok(updated);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleter(@PathVariable Long id) {
        return transactionService.findByIdAndUserId(id)
                .map(transaction -> {
                    transactionService.deleteById(id);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}