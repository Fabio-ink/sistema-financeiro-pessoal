package br.com.fabioprada.financial.controller;

import br.com.fabioprada.financial.dto.MonthSummaryDTO;
import br.com.fabioprada.financial.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5174")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public Map<String, MonthSummaryDTO> getSummary() {
        return dashboardService.getMonthlySummaries();
    }
}
