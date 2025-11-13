package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.Transaction;
import br.com.fabioprada.financial.model.TransactionType;
import br.com.fabioprada.financial.model.User;
import br.com.fabioprada.financial.repository.TransactionRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> searchTransactions(String name, LocalDate startDate, LocalDate endDate, Long categoryId, String transactionType) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                return transactionRepository.findAll((Root<Transaction> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
                    List<Predicate> predicates = new ArrayList<>();
                    predicates.add(cb.equal(root.get("user").get("id"), userId));
                    if (name != null && !name.isEmpty()) {
                        predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
                    }
                    if (startDate != null) {
                        predicates.add(cb.greaterThanOrEqualTo(root.get("creationDate"), startDate));
                    }
                    if (endDate != null) {
                        predicates.add(cb.lessThanOrEqualTo(root.get("creationDate"), endDate));
                    }
                    if (categoryId != null) {
                        predicates.add(cb.equal(root.get("category").get("id"), categoryId));
                    }
                    if (transactionType != null && !transactionType.isEmpty()) {
                        try {
                            predicates.add(cb.equal(root.get("transactionType"), TransactionType.valueOf(transactionType)));
                        } catch (IllegalArgumentException e) {
                            System.err.println("Invalid TransactionType: " + transactionType);
                        }
                    }
                    return cb.and(predicates.toArray(new Predicate[0]));
                });
            }
        }
        return Collections.emptyList();
    }

    public List<Transaction> findAllByUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                return transactionRepository.findAllByUserId(userId);
            }
        }
        return Collections.emptyList();
    }

    public Optional<Transaction> findByIdAndUserId(Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                return transactionRepository.findByIdAndUserId(id, userId);
            }
        }
        return Optional.empty();
    }

    public Transaction save(Transaction transaction) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            transaction.setUser(user);
            return transactionRepository.save(transaction);
        }
        throw new IllegalStateException("User not authenticated, cannot save transaction.");
    }

    public void deleteById(Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                transactionRepository.findByIdAndUserId(id, userId).ifPresent(transactionRepository::delete);
            }
        }
    }
}
