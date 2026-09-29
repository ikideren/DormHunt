package usecase

import (
	"context"
	"time"

	"github.com/Devounn/DormHunt/internal/entity"
	"github.com/google/uuid"
)

type ReportUseCase struct {
	repo entity.ReportRepository
}

func NewReportUseCase(r entity.ReportRepository) *ReportUseCase {
	return &ReportUseCase{repo: r}
}

func (u *ReportUseCase) SubmitReport(ctx context.Context, rpt *entity.Report) error {
	rpt.ID = uuid.New()
	rpt.CreatedAt = time.Now()
	rpt.Status = entity.ReportOpen
	return u.repo.Create(rpt)
}

func (u *ReportUseCase) ListOpenReports(ctx context.Context) ([]*entity.Report, error) {
	return u.repo.ListOpen()
}

func (u *ReportUseCase) ResolveReport(ctx context.Context, id uuid.UUID) error {
	return u.repo.UpdateStatus(id, entity.ReportResolved)
}
