package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.MonthlyPlanning;
import br.com.fabioprada.financial.model.User;
import br.com.fabioprada.financial.repository.MonthlyPlanningRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@Service
@Transactional
public class MonthlyPlanningService {

    private final MonthlyPlanningRepository monthlyPlanningRepository;
    private final br.com.fabioprada.financial.repository.TransactionRepository transactionRepository;

    public MonthlyPlanningService(MonthlyPlanningRepository monthlyPlanningRepository,
            br.com.fabioprada.financial.repository.TransactionRepository transactionRepository) {
        this.monthlyPlanningRepository = monthlyPlanningRepository;
        this.transactionRepository = transactionRepository;
    }

    public Page<MonthlyPlanning> findAll(Pageable pageable, Integer month, Integer year, Long categoryId) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                Specification<MonthlyPlanning> spec = (root, query, criteriaBuilder) -> {
                    Predicate p = criteriaBuilder.equal(root.get("user").get("id"), userId);

                    if (month != null) {
                        p = criteriaBuilder.and(p, criteriaBuilder.equal(root.get("month"), month));
                    }
                    if (year != null) {
                        p = criteriaBuilder.and(p, criteriaBuilder.equal(root.get("year"), year));
                    }
                    if (categoryId != null) {
                        p = criteriaBuilder.and(p, criteriaBuilder.equal(root.get("category").get("id"), categoryId));
                    }
                    return p;
                };

                Page<MonthlyPlanning> page = monthlyPlanningRepository.findAll(spec, pageable);

                return page.map(plan -> {
                    if (plan.getCategory() != null) {
                        java.math.BigDecimal spent = transactionRepository
                                .sumAmountByCategoryIdAndYearAndMonthAndUserId(
                                        plan.getCategory().getId(),
                                        plan.getYear(),
                                        plan.getMonth(),
                                        userId);
                        plan.setSpentAmount(spent != null ? spent : java.math.BigDecimal.ZERO);
                    } else {
                        plan.setSpentAmount(java.math.BigDecimal.ZERO);
                    }
                    return plan;
                });
            }
        }
        return Page.empty();
    }

    public Optional<MonthlyPlanning> findById(Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                return monthlyPlanningRepository.findById(id)
                        .filter(planning -> planning.getUser().getId().equals(Objects.requireNonNull(userId)));
            }
        }
        return Optional.empty();
    }

    public MonthlyPlanning save(MonthlyPlanning monthlyPlanning) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            monthlyPlanning.setUser(user);
            return monthlyPlanningRepository.save(monthlyPlanning);
        }
        throw new IllegalStateException("User not authenticated, cannot save monthly planning.");
    }

    public void deleteById(Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                monthlyPlanningRepository.deleteByIdAndUserId(id, Objects.requireNonNull(userId));
            }
        }
    }

    public void deleteMultiple(List<Long> ids) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                for (Long id : ids) {
                    monthlyPlanningRepository.deleteByIdAndUserId(id, Objects.requireNonNull(userId));
                }
            }
        }
    }
}