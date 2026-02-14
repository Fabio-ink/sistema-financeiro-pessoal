package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.dto.ImportDataDTO;
import br.com.fabioprada.financial.model.MonthlyPlanning;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;

public class ExcelServiceTest {

    @Test
    void testImportPlanningOnlyWithCustomName() throws IOException {
        ExcelService service = new ExcelService();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Create a sheet with a non-standard name
            Sheet sheet = workbook.createSheet("Minhas Metas");

            // Create Header
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Mês");
            header.createCell(1).setCellValue("Ano");
            header.createCell(2).setCellValue("Categoria");
            header.createCell(3).setCellValue("Valor Estimado");

            // Create Data Row
            Row data = sheet.createRow(1);
            data.createCell(0).setCellValue(1);
            data.createCell(1).setCellValue(2025);
            data.createCell(2).setCellValue("Alimentação");
            data.createCell(3).setCellValue(1500.00);

            workbook.write(out);

            ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
            ImportDataDTO result = service.importData(in);

            Assertions.assertNotNull(result);
            Assertions.assertTrue(result.getTransactions().isEmpty(), "Transactions should be empty");
            Assertions.assertFalse(result.getMonthlyPlannings().isEmpty(), "Should have imported planning data");

            MonthlyPlanning plan = result.getMonthlyPlannings().get(0);
            Assertions.assertEquals(1, plan.getMonth());
            Assertions.assertEquals(2025, plan.getYear());
            Assertions.assertEquals("Alimentação", plan.getCategory().getName());
            Assertions.assertEquals(new BigDecimal("1500.0"), plan.getEstimatedAmount());
        }
    }
}
