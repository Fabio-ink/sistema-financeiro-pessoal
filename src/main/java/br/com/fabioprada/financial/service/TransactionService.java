package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.Transaction;
import br.com.fabioprada.financial.model.TransactionType;
import br.com.fabioprada.financial.model.User;
import br.com.fabioprada.financial.repository.TransactionRepository;
import br.com.fabioprada.financial.security.UserContextService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@SuppressWarnings("null")
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserContextService userContextService;

    public TransactionService(TransactionRepository transactionRepository, UserContextService userContextService) {
        this.transactionRepository = transactionRepository;
        this.userContextService = userContextService;
    }

    public Page<Transaction> searchTransactions(String name, LocalDate startDate, LocalDate endDate, Long categoryId,
            String transactionType, Pageable pageable) {
        return userContextService.getCurrentUser().map(user -> {
            Long userId = user.getId();
            return transactionRepository
                    .findAll((Root<Transaction> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
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
                                predicates.add(cb.equal(root.get("transactionType"),
                                        TransactionType.valueOf(transactionType)));
                            } catch (IllegalArgumentException e) {
                                // Log invalid type if needed
                            }
                        }
                        return cb.and(predicates.toArray(new Predicate[0]));
                    }, pageable);
        }).orElse(Page.empty());
    }

    public List<Transaction> findAllByUserId() {
        return userContextService.getCurrentUser()
                .map(user -> transactionRepository.findAllByUserId(user.getId()))
                .orElse(Collections.emptyList());
    }

    public Optional<Transaction> findByIdAndUserId(Long id) {
        return userContextService.getCurrentUser()
                .flatMap(user -> transactionRepository.findByIdAndUserId(id, user.getId()));
    }

    @Transactional
    public Transaction save(Transaction transaction) {
        User user = userContextService.getCurrentUserOrThrow();
        transaction.setUser(user);

        if (transaction.getTotalInstallments() != null && transaction.getTotalInstallments() > 1) {
            return saveInstallments(transaction, user);
        }

        return transactionRepository.save(transaction);
    }

    private Transaction saveInstallments(Transaction transaction, User user) {
        // Ensure the first transaction has installment number 1
        if (transaction.getInstallmentNumber() == null) {
            transaction.setInstallmentNumber(1);
        }

        // Calculate installment amount
        BigDecimal installmentAmount = transaction.getAmount().divide(
                BigDecimal.valueOf(transaction.getTotalInstallments()), 2, java.math.RoundingMode.HALF_UP);
        transaction.setAmount(installmentAmount);

        // Save the first installment
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Create and save subsequent installments
        for (int i = 2; i <= transaction.getTotalInstallments(); i++) {
            Transaction installment = new Transaction();
            installment.setUser(user);
            installment.setName(transaction.getName());
            installment.setAmount(installmentAmount);
            installment.setTransactionType(transaction.getTransactionType());
            installment.setCategory(transaction.getCategory());
            installment.setOutAccount(transaction.getOutAccount());
            installment.setInAccount(transaction.getInAccount());
            installment.setTotalInstallments(transaction.getTotalInstallments());
            installment.setInstallmentNumber(i);

            // Increment date by 1 month for each installment
            installment.setCreationDate(transaction.getCreationDate().plusMonths(i - 1));

            transactionRepository.save(installment);
        }
        return savedTransaction;
    }

    public void deleteById(Long id) {
        userContextService.getCurrentUser().ifPresent(user -> transactionRepository.findByIdAndUserId(id, user.getId())
                .ifPresent(transactionRepository::delete));
    }

    public void deleteMultiple(List<Long> ids) {
        userContextService.getCurrentUser().ifPresent(user -> {
            Long userId = user.getId();
            for (Long id : ids) {
                transactionRepository.findByIdAndUserId(id, userId).ifPresent(transactionRepository::delete);
            }
        });
    }
}
