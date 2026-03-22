package com.tenaco.issue.service;

import com.tenaco.auth.security.UserPrincipal;
import com.tenaco.issue.dto.IssueDto;
import com.tenaco.issue.dto.IssueRequest;
import com.tenaco.issue.dto.StatusUpdateRequest;
import com.tenaco.issue.entity.Issue;
import com.tenaco.issue.enums.IssuePriority;
import com.tenaco.issue.enums.IssueStatus;
import com.tenaco.issue.repository.IssueRepository;
import com.tenaco.property.entity.Property;
import com.tenaco.property.repository.PropertyRepository;
import com.tenaco.notification.service.NotificationService;
import com.tenaco.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final PropertyRepository propertyRepository;
    private final NotificationService notificationService;

    public IssueService(IssueRepository issueRepository, PropertyRepository propertyRepository,
                        NotificationService notificationService) {
        this.issueRepository = issueRepository;
        this.propertyRepository = propertyRepository;
        this.notificationService = notificationService;
    }

    public List<IssueDto> getIssues() {
        User user = UserPrincipal.getCurrentUser();
        List<Issue> issues;

        if (user.getRole() == User.Role.LANDLORD) {
            issues = issueRepository.findByPropertyLandlordIdOrderByCreatedAtDesc(user.getId());
        } else {
            issues = issueRepository.findByTenantIdOrderByCreatedAtDesc(user.getId());
        }

        return issues.stream().map(IssueDto::from).collect(Collectors.toList());
    }

    public IssueDto getIssue(UUID id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        return IssueDto.from(issue);
    }

    @Transactional
    public IssueDto createIssue(IssueRequest request) {
        User user = UserPrincipal.getCurrentUser();

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Issue issue = Issue.builder()
                .property(property)
                .tenant(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null
                        ? IssuePriority.valueOf(request.getPriority().toUpperCase())
                        : IssuePriority.MEDIUM)
                .build();

        issue = issueRepository.save(issue);
        notificationService.notifyNewIssue(issue);
        return IssueDto.from(issue);
    }

    @Transactional
    public IssueDto updateStatus(UUID id, StatusUpdateRequest request) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setStatus(IssueStatus.valueOf(request.getStatus().toUpperCase()));
        issue = issueRepository.save(issue);
        notificationService.notifyStatusUpdate(issue);
        return IssueDto.from(issue);
    }
}
