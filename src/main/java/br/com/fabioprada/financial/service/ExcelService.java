package br.com.fabioprada.financial.service;

import br.com.fabioprada.financial.model.Account;
import br.com.fabioprada.financial.model.Category;
import br.com.fabioprada.financial.model.Transaction;
import br.com.fabioprada.financial.model.TransactionType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ExcelService {

    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    // Transactions Constants
    static String[] TRANSACTION_HEADERS = { "Nome", "Data", "Valor", "Tipo", "Categoria", "Conta Saída",
            "Conta Entrada" };
    static String TRANSACTIONS_SHEET = "Transações";

    // Planning Constants
    static String[] PLANNING_HEADERS = { "Mês", "Ano", "Categoria", "Valor Estimado" };
    static String PLANNING_SHEET = "Planejamento";

    public ByteArrayInputStream exportToExcel(List<Transaction> transactions,
            List<br.com.fabioprada.financial.model.MonthlyPlanning> plannings) {

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // --- Transactions Sheet ---
            Sheet transSheet = workbook.createSheet(TRANSACTIONS_SHEET);
            Row transHeaderRow = transSheet.createRow(0);
            for (int col = 0; col < TRANSACTION_HEADERS.length; col++) {
                Cell cell = transHeaderRow.createCell(col);
                cell.setCellValue(TRANSACTION_HEADERS[col]);
            }

            int transRowIdx = 1;
            for (Transaction transaction : transactions) {
                Row row = transSheet.createRow(transRowIdx++);
                row.createCell(0).setCellValue(transaction.getName());
                row.createCell(1).setCellValue(transaction.getCreationDate().toString());
                row.createCell(2).setCellValue(transaction.getAmount().doubleValue());
                row.createCell(3).setCellValue(transaction.getTransactionType().name());

                if (transaction.getCategory() != null) {
                    row.createCell(4).setCellValue(transaction.getCategory().getName());
                }

                if (transaction.getOutAccount() != null) {
                    row.createCell(5).setCellValue(transaction.getOutAccount().getName());
                }

                if (transaction.getInAccount() != null) {
                    row.createCell(6).setCellValue(transaction.getInAccount().getName());
                }
            }

            // --- Planning Sheet ---
            if (plannings != null) {
                Sheet planSheet = workbook.createSheet(PLANNING_SHEET);
                Row planHeaderRow = planSheet.createRow(0);
                for (int col = 0; col < PLANNING_HEADERS.length; col++) {
                    Cell cell = planHeaderRow.createCell(col);
                    cell.setCellValue(PLANNING_HEADERS[col]);
                }

                int planRowIdx = 1;
                for (br.com.fabioprada.financial.model.MonthlyPlanning plan : plannings) {
                    Row row = planSheet.createRow(planRowIdx++);
                    row.createCell(0).setCellValue(plan.getMonth());
                    row.createCell(1).setCellValue(plan.getYear());
                    if (plan.getCategory() != null) {
                        row.createCell(2).setCellValue(plan.getCategory().getName());
                    }
                    row.createCell(3).setCellValue(plan.getEstimatedAmount().doubleValue());
                }
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }

    public br.com.fabioprada.financial.dto.ImportDataDTO importData(InputStream is) {
        br.com.fabioprada.financial.dto.ImportDataDTO data = new br.com.fabioprada.financial.dto.ImportDataDTO();
        List<Transaction> transactions = new ArrayList<>();
        List<br.com.fabioprada.financial.model.MonthlyPlanning> plannings = new ArrayList<>();

        try {
            Workbook workbook = new XSSFWorkbook(is);

            // --- Import Transactions ---
            Sheet transSheet = workbook.getSheet(TRANSACTIONS_SHEET);
            System.out.println("Looking for Transactions sheet: " + TRANSACTIONS_SHEET);
            if (transSheet == null) {
                System.out.println("Transactions sheet not found by name. Checking first sheet.");
                // Fallback: Check if it's the first sheet and looks like transactions (has
                // Name/Date/Amount columns)
                // Or simply default to first sheet if name doesn't match, legacy support
                Sheet firstSheet = workbook.getSheetAt(0);
                // Simple heuristic: if sheet names don't match standard, assume first is
                // transactions
                if (!PLANNING_SHEET.equals(firstSheet.getSheetName())) {
                    transSheet = firstSheet;
                    System.out.println("Using first sheet as Transactions: " + firstSheet.getSheetName());
                }
            }

            if (transSheet != null) {
                transactions = parseTransactions(transSheet);
                System.out.println("Parsed " + transactions.size() + " transactions.");
            } else {
                System.out.println("No Transactions sheet found to parse.");
            }

            // --- Import Planning ---
            Sheet planSheet = workbook.getSheet(PLANNING_SHEET);
            System.out.println("Looking for Planning sheet: " + PLANNING_SHEET);
            if (planSheet != null) {
                plannings = parsePlanning(planSheet);
                System.out.println("Parsed " + plannings.size() + " planning items.");
            } else {
                System.out.println("Planning sheet '" + PLANNING_SHEET + "' NOT found in workbook. Available sheets: "
                        + workbook.getNumberOfSheets());
                for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                    System.out.println(" - Sheet " + i + ": " + workbook.getSheetName(i));
                }
            }

            workbook.close();

            data.setTransactions(transactions);
            data.setMonthlyPlannings(plannings);
            return data;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }

    private List<Transaction> parseTransactions(Sheet sheet) {
        List<Transaction> transactions = new ArrayList<>();
        Iterator<Row> rows = sheet.iterator();
        int rowNumber = 0;
        while (rows.hasNext()) {
            Row currentRow = rows.next();
            if (rowNumber == 0) {
                rowNumber++;
                continue;
            } // Skip header

            Transaction transaction = new Transaction();

            Cell nameCell = currentRow.getCell(0);
            if (nameCell != null)
                transaction.setName(getCellValueAsString(nameCell));

            Cell dateCell = currentRow.getCell(1);
            if (dateCell != null) {
                String dateStr = getCellValueAsString(dateCell);
                try {
                    transaction.setCreationDate(LocalDate.parse(dateStr));
                } catch (Exception e) {
                    if (dateCell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(dateCell)) {
                        transaction.setCreationDate(dateCell.getLocalDateTimeCellValue().toLocalDate());
                    } else {
                        transaction.setCreationDate(LocalDate.parse(dateStr));
                    }
                }
            }

            Cell amountCell = currentRow.getCell(2);
            if (amountCell != null) {
                if (amountCell.getCellType() == CellType.NUMERIC) {
                    transaction.setAmount(BigDecimal.valueOf(amountCell.getNumericCellValue()));
                } else {
                    transaction.setAmount(new BigDecimal(getCellValueAsString(amountCell)));
                }
            }

            Cell typeCell = currentRow.getCell(3);
            if (typeCell != null)
                transaction.setTransactionType(TransactionType.valueOf(getCellValueAsString(typeCell)));

            Cell categoryCell = currentRow.getCell(4);
            if (categoryCell != null) {
                String catName = getCellValueAsString(categoryCell);
                if (!catName.isEmpty()) {
                    Category c = new Category();
                    c.setName(catName);
                    transaction.setCategory(c);
                }
            }

            Cell outCell = currentRow.getCell(5);
            if (outCell != null) {
                String outName = getCellValueAsString(outCell);
                if (!outName.isEmpty()) {
                    Account a = new Account();
                    a.setName(outName);
                    transaction.setOutAccount(a);
                }
            }

            Cell inCell = currentRow.getCell(6);
            if (inCell != null) {
                String inName = getCellValueAsString(inCell);
                if (!inName.isEmpty()) {
                    Account a = new Account();
                    a.setName(inName);
                    transaction.setInAccount(a);
                }
            }

            transactions.add(transaction);
        }
        return transactions;
    }

    private List<br.com.fabioprada.financial.model.MonthlyPlanning> parsePlanning(Sheet sheet) {
        List<br.com.fabioprada.financial.model.MonthlyPlanning> plannings = new ArrayList<>();
        Iterator<Row> rows = sheet.iterator();
        int rowNumber = 0;
        while (rows.hasNext()) {
            Row currentRow = rows.next();
            if (rowNumber == 0) {
                rowNumber++;
                continue;
            }

            br.com.fabioprada.financial.model.MonthlyPlanning mp = new br.com.fabioprada.financial.model.MonthlyPlanning();

            // Month
            Cell monthCell = currentRow.getCell(0);
            if (monthCell != null)
                mp.setMonth((int) Double.parseDouble(getCellValueAsString(monthCell)));

            // Year
            Cell yearCell = currentRow.getCell(1);
            if (yearCell != null)
                mp.setYear((int) Double.parseDouble(getCellValueAsString(yearCell)));

            // Category
            Cell catCell = currentRow.getCell(2);
            if (catCell != null) {
                String catName = getCellValueAsString(catCell);
                if (!catName.isEmpty()) {
                    Category c = new Category();
                    c.setName(catName);
                    mp.setCategory(c);
                }
            }

            // Estimated Amount
            Cell amountCell = currentRow.getCell(3);
            if (amountCell != null) {
                if (amountCell.getCellType() == CellType.NUMERIC) {
                    mp.setEstimatedAmount(BigDecimal.valueOf(amountCell.getNumericCellValue()));
                } else {
                    mp.setEstimatedAmount(new BigDecimal(getCellValueAsString(amountCell)));
                }
            }

            plannings.add(mp);
        }
        return plannings;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
}
