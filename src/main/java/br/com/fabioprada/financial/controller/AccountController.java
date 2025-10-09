package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.model.Account;
import br.com.fabioprada.financial.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173") // Permite acesso do nosso frontend
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping
    public List<Account> listAll() {
        return accountRepository.findAll();
    }

    @PostMapping
    public Account create(@RequestBody Account account) {
        return accountRepository.save(account);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updated(@PathVariable Long id, @RequestBody Account accountDetails) {
        return accountRepository.findById(id)
                .map(account -> {
                    account.setName(accountDetails.getName());
                    account.setInitialBalance(accountDetails.getInitialBalance());
                    Account updated = accountRepository.save(account);
                    return ResponseEntity.ok(updated);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleter(@PathVariable Long id) {
        return accountRepository.findById(id)
                .map(conta -> {
                    accountRepository.delete(conta);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}