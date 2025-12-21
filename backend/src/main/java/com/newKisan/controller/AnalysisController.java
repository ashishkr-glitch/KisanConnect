package com.newKisan.controller;

import com.newKisan.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analysis")
@CrossOrigin(origins = "*")
public class AnalysisController {

    @Autowired
    private AnalysisService analysisService;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        return analysisService.getAnalysisSummary();
    }
}
