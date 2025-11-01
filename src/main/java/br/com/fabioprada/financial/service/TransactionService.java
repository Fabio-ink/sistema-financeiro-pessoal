package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.Transaction;
import br.com.fabioprada.financial.model.TransactionType;
import br.com.fabioprada.financial.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> searchTransactions(String name, LocalDate startDate, LocalDate endDate, Long categoryId, String transactionType) {
        return transactionRepository.findAll((Root<Transaction> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

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
                    // Log the error or handle invalid transaction type gracefully
                    System.err.println("Invalid TransactionType: " + transactionType);
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }
}