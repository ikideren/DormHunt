package repository

import (
	"context"
	"fmt"

	"github.com/Devounn/DormHunt/internal/entity"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresReportRepository struct {
	db *pgxpool.Pool
}

func NewPostgresReportRepository(db *pgxpool.Pool) *PostgresReportRepository {
	return &PostgresReportRepository{db: db}
}

func (r *PostgresReportRepository) Create(report *entity.Report) error {
	query := `INSERT INTO reports (id, reporter_id, reported_item_id, reported_item_type, reason, details, status, created_at)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`
	_, err := r.db.Exec(context.Background(), query, report.ID, report.ReporterID, report.ReportedItemID, report.ReportedItemType, report.Reason, report.Details, report.Status, report.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to create report: %w", err)
	}
	return nil
}

func (r *PostgresReportRepository) ListOpen() ([]*entity.Report, error) {
	query := `SELECT id, reporter_id, reported_item_id, reported_item_type, reason, details, status, created_at FROM reports WHERE status = 'open'`
	rows, err := r.db.Query(context.Background(), query)
	if err != nil {
		return nil, fmt.Errorf("failed to query reports: %w", err)
	}
	defer rows.Close()

	var out []*entity.Report
	for rows.Next() {
		rpt := &entity.Report{}
		if err := rows.Scan(&rpt.ID, &rpt.ReporterID, &rpt.ReportedItemID, &rpt.ReportedItemType, &rpt.Reason, &rpt.Details, &rpt.Status, &rpt.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan report: %w", err)
		}
		out = append(out, rpt)
	}
	return out, nil
}

func (r *PostgresReportRepository) UpdateStatus(id uuid.UUID, status entity.ReportStatus) error {
	query := `UPDATE reports SET status = $1 WHERE id = $2`
	_, err := r.db.Exec(context.Background(), query, status, id)
	if err != nil {
		return fmt.Errorf("failed to update report status: %w", err)
	}
	return nil
}
