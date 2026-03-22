package com.tenaco.issue.service;

import com.tenaco.auth.security.UserPrincipal;
import com.tenaco.issue.dto.DashboardStatsDto;
import com.tenaco.issue.enums.IssueStatus;
import com.tenaco.issue.repository.IssueRepository;
import com.tenaco.property.repository.PropertyRepository;
import com.tenaco.property.repository.TenantRepository;
import com.tenaco.user.entity.User;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final PropertyRepository propertyRepository;
    private final TenantRepository tenantRepository;
    private final IssueRepository issueRepository;

    public DashboardService(PropertyRepository propertyRepository, TenantRepository tenantRepository, IssueRepository issueRepository) {
        this.propertyRepository = propertyRepository;
        this.tenantRepository = tenantRepository;
        this.issueRepository = issueRepository;
    }

    public DashboardStatsDto getStats() {
        User user = UserPrincipal.getCurrentUser();

        if (user.getRole() == User.Role.LANDLORD) {
            return new DashboardStatsDto(
                    propertyRepository.countByLandlordId(user.getId()),
                    tenantRepository.countByPropertyLandlordId(user.getId()),
                    issueRepository.countByPropertyLandlordIdAndStatus(user.getId(), IssueStatus.OPEN)
                            + issueRepository.countByPropertyLandlordIdAndStatus(user.getId(), IssueStatus.IN_PROGRESS),
                    issueRepository.countByPropertyLandlordIdAndStatus(user.getId(), IssueStatus.RESOLVED)
                            + issueRepository.countByPropertyLandlordIdAndStatus(user.getId(), IssueStatus.CLOSED)
            );
        } else {
            return new DashboardStatsDto(
                    0,
                    0,
                    issueRepository.countByTenantIdAndStatus(user.getId(), IssueStatus.OPEN)
                            + issueRepository.countByTenantIdAndStatus(user.getId(), IssueStatus.IN_PROGRESS),
                    issueRepository.countByTenantIdAndStatus(user.getId(), IssueStatus.RESOLVED)
                            + issueRepository.countByTenantIdAndStatus(user.getId(), IssueStatus.CLOSED)
            );
        }
    }
}
