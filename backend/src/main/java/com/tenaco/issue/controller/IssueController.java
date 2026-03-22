package com.tenaco.issue.controller;

import com.tenaco.issue.dto.IssueDto;
import com.tenaco.issue.dto.IssueRequest;
import com.tenaco.issue.dto.StatusUpdateRequest;
import com.tenaco.issue.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping
    public ResponseEntity<List<IssueDto>> getIssues() {
        return ResponseEntity.ok(issueService.getIssues());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueDto> getIssue(@PathVariable UUID id) {
        return ResponseEntity.ok(issueService.getIssue(id));
    }

    @PostMapping
    public ResponseEntity<IssueDto> createIssue(@Valid @RequestBody IssueRequest request) {
        return ResponseEntity.ok(issueService.createIssue(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IssueDto> updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(issueService.updateStatus(id, request));
    }
}
