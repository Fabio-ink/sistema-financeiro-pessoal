package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.model.Transaction;
import br.com.fabioprada.financial.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5174")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<Transaction> listAll() {
        return transactionRepository.findAll();
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updated(@PathVariable Long id, @RequestBody Transaction transactionDetails) {
        return transactionRepository.findById(id)
                .map(transaction -> {
                    transaction.setName(transactionDetails.getName());
                    transaction.setAmount(transactionDetails.getAmount());
                    transaction.setCreationDate(transactionDetails.getCreationDate());
                    transaction.setTransactionType(transactionDetails.getTransactionType());
                    transaction.setCategory(transactionDetails.getCategory());
                    transaction.setOutAccount(transactionDetails.getOutAccount());
                    transaction.setInAccount(transactionDetails.getInAccount());
                    Transaction updated = transactionRepository.save(transaction);
                    return ResponseEntity.ok(updated);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleter(@PathVariable Long id) {
        return transactionRepository.findById(id)
                .map(transaction -> {
                    transactionRepository.delete(transaction);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}