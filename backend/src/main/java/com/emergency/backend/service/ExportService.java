package com.emergency.backend.service;

import com.emergency.backend.entity.Incident;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

/**
 * Service for data export operations.
 * Generates Excel files for incident reports (Admin feature).
 */
@Service
public class ExportService {

    /**
     * Export a list of incidents to an Excel (.xlsx) file.
     * Includes all incident fields with formatted headers and auto-sized columns.
     */
    public byte[] exportIncidentsToExcel(List<Incident> incidents) throws Exception {

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Incidents Report");

            // Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.RED.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setFont(createHeaderFont(workbook));
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            // Create data style
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setAlignment(HorizontalAlignment.LEFT);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);

            // Create header row
            String[] headers = {
                    "ID", "Title", "Category", "Description",
                    "Location", "Status", "Reported By", "Image",
                    "Latitude", "Longitude", "Created At"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Fill data rows
            int rowNum = 1;
            for (Incident incident : incidents) {

                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(
                        incident.getId() != null ? incident.getId() : 0);
                row.createCell(1).setCellValue(
                        incident.getTitle() != null ? incident.getTitle() : "");
                row.createCell(2).setCellValue(
                        incident.getCategory() != null ? incident.getCategory() : "");
                row.createCell(3).setCellValue(
                        incident.getDescription() != null ? incident.getDescription() : "");
                row.createCell(4).setCellValue(
                        incident.getLocation() != null ? incident.getLocation() : "");
                row.createCell(5).setCellValue(
                        incident.getStatus() != null ? incident.getStatus() : "");
                row.createCell(6).setCellValue(
                        incident.getUserEmail() != null ? incident.getUserEmail() : "");
                row.createCell(7).setCellValue(
                        incident.getImage() != null ? incident.getImage() : "No Image");
                row.createCell(8).setCellValue(
                        incident.getLatitude() != null ? incident.getLatitude() : 0);
                row.createCell(9).setCellValue(
                        incident.getLongitude() != null ? incident.getLongitude() : 0);
                row.createCell(10).setCellValue(
                        incident.getCreatedAt() != null ?
                                incident.getCreatedAt().toString() : "");

                // Apply data style to all cells in the row
                for (int i = 0; i < headers.length; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    /**
     * Create a bold white font for headers.
     */
    private Font createHeaderFont(Workbook workbook) {
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        font.setFontHeightInPoints((short) 12);
        return font;
    }
}

