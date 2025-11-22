package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.model.MonthlyPlanning;
import br.com.fabioprada.financial.service.MonthlyPlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monthly-planning")
public class MonthlyPlanningController {

    @Autowired
    private MonthlyPlanningService monthlyPlanningService;

    @GetMapping
    public List<MonthlyPlanning> getAllMonthlyPlanning() {
        return monthlyPlanningService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonthlyPlanning> getMonthlyPlanningById(@PathVariable Long id) {
        return monthlyPlanningService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public MonthlyPlanning createMonthlyPlanning(@RequestBody MonthlyPlanning monthlyPlanning) {
        return monthlyPlanningService.save(monthlyPlanning);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonthlyPlanning> updateMonthlyPlanning(@PathVariable Long id,
            @RequestBody MonthlyPlanning monthlyPlanningDetails) {
        return monthlyPlanningService.findById(id)
                .map(monthlyPlanning -> {
                    monthlyPlanning.setMonth(monthlyPlanningDetails.getMonth());
                    monthlyPlanning.setYear(monthlyPlanningDetails.getYear());
                    monthlyPlanning.setCategory(monthlyPlanningDetails.getCategory());
                    monthlyPlanning.setEstimatedAmount(monthlyPlanningDetails.getEstimatedAmount());
                    MonthlyPlanning updatedMonthlyPlanning = monthlyPlanningService.save(monthlyPlanning);
                    return ResponseEntity.ok(updatedMonthlyPlanning);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMonthlyPlanning(@PathVariable Long id) {
        return monthlyPlanningService.findById(id)
                .map(monthlyPlanning -> {
                    monthlyPlanningService.deleteById(id);
                    return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<?> deleteMultiple(@RequestBody List<Long> ids) {
        monthlyPlanningService.deleteMultiple(ids);
        return ResponseEntity.ok().build();
    }
}