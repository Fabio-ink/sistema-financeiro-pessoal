package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.Account;
import br.com.fabioprada.financial.model.User;
import br.com.fabioprada.financial.repository.AccountRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<Account> findAll() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                return accountRepository.findAllByUserId(Objects.requireNonNull(userId));
            }
        }
        return Collections.emptyList();
    }

    public Optional<Account> findById(Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                return accountRepository.findByIdAndUserId(id, Objects.requireNonNull(userId));
            }
        }
        return Optional.empty();
    }

    public Account save(Account account) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
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
        throw new IllegalStateException("User not authenticated, cannot save account.");
    }

    public void deleteById(Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                accountRepository.findByIdAndUserId(id, Objects.requireNonNull(userId))
                        .ifPresent(accountRepository::delete);
            }
        }
    }
}