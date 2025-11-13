package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.MonthlyPlanning;
import br.com.fabioprada.financial.model.User;
import br.com.fabioprada.financial.repository.MonthlyPlanningRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MonthlyPlanningService {

    private final MonthlyPlanningRepository monthlyPlanningRepository;

    public MonthlyPlanningService(MonthlyPlanningRepository monthlyPlanningRepository) {
        this.monthlyPlanningRepository = monthlyPlanningRepository;
    }

    public List<MonthlyPlanning> findAll() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            Long userId = user.getId();
            if (userId != null) {
                return monthlyPlanningRepository.findAllByUserId(Objects.requireNonNull(userId));
            }
        }
        return Collections.emptyList();
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
}