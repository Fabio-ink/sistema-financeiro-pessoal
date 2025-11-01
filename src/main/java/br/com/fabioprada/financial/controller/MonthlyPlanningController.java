package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.model.MonthlyPlanning;
import br.com.fabioprada.financial.repository.MonthlyPlanningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/monthly-planning")
@CrossOrigin(origins = "http://localhost:5173")
public class MonthlyPlanningController {

    @Autowired
    private MonthlyPlanningRepository monthlyPlanningRepository;

    @GetMapping
    public List<MonthlyPlanning> getAllMonthlyPlanning() {
        return monthlyPlanningRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonthlyPlanning> getMonthlyPlanningById(@PathVariable Long id) {
        Optional<MonthlyPlanning> monthlyPlanning = monthlyPlanningRepository.findById(id);
        return monthlyPlanning.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public MonthlyPlanning createMonthlyPlanning(@RequestBody MonthlyPlanning monthlyPlanning) {
        return monthlyPlanningRepository.save(monthlyPlanning);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonthlyPlanning> updateMonthlyPlanning(@PathVariable Long id, @RequestBody MonthlyPlanning monthlyPlanningDetails) {
        return monthlyPlanningRepository.findById(id)
                .map(monthlyPlanning -> {
                    monthlyPlanning.setMonth(monthlyPlanningDetails.getMonth());
                    monthlyPlanning.setYear(monthlyPlanningDetails.getYear());
                    monthlyPlanning.setCategory(monthlyPlanningDetails.getCategory());
                    monthlyPlanning.setEstimatedAmount(monthlyPlanningDetails.getEstimatedAmount());
                    MonthlyPlanning updatedMonthlyPlanning = monthlyPlanningRepository.save(monthlyPlanning);
                    return ResponseEntity.ok(updatedMonthlyPlanning);
                }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<?> deleteMultipleMonthlyPlanning(@RequestBody List<Long> ids) {
        monthlyPlanningRepository.deleteAllById(ids);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMonthlyPlanning(@PathVariable Long id) {
        return monthlyPlanningRepository.findById(id)
                .map(monthlyPlanning -> {
                    monthlyPlanningRepository.delete(monthlyPlanning);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}