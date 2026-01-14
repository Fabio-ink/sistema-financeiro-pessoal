package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.Account;
import br.com.fabioprada.financial.model.User;
import br.com.fabioprada.financial.repository.AccountRepository;
import br.com.fabioprada.financial.security.UserContextService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserContextService userContextService;

    public AccountService(AccountRepository accountRepository, UserContextService userContextService) {
        this.accountRepository = accountRepository;
        this.userContextService = userContextService;
    }

    public List<Account> findAll() {
        return userContextService.getCurrentUser()
                .map(user -> accountRepository.findAllByUserId(user.getId()))
                .orElse(Collections.emptyList());
    }

    public Optional<Account> findById(Long id) {
        return userContextService.getCurrentUser()
                .flatMap(user -> accountRepository.findByIdAndUserId(id, user.getId()));
    }

    public Account save(Account account) {
        User user = userContextService.getCurrentUserOrThrow();
        account.setUser(user);

        if (account.getId() != null) {
            // Existing account, adjust current balance based on initial balance change
            Account existingAccount = accountRepository.findById(account.getId())
                    .orElseThrow(() -> new RuntimeException("Account not found with id: " + account.getId()));

            BigDecimal oldInitialBalance = existingAccount.getInitialBalance();
            BigDecimal newInitialBalance = account.getInitialBalance();

            if (oldInitialBalance.compareTo(newInitialBalance) != 0) {
                BigDecimal difference = newInitialBalance.subtract(oldInitialBalance);
                account.setCurrentBalance(existingAccount.getCurrentBalance().add(difference));
            } else {
                account.setCurrentBalance(existingAccount.getCurrentBalance());
            }
        } else {
            // New account, set current balance to initial balance
            account.setCurrentBalance(account.getInitialBalance());
        }

        return accountRepository.save(account);
    }

    public void deleteById(Long id) {
        userContextService.getCurrentUser().ifPresent(user -> accountRepository.findByIdAndUserId(id, user.getId())
                .ifPresent(accountRepository::delete));
    }
}