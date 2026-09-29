package repository

import (
	"context"
	"fmt"

	"github.com/Devounn/DormHunt/internal/entity"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresDormRepository struct {
	db *pgxpool.Pool
}

func NewPostgresDormRepository(db *pgxpool.Pool) *PostgresDormRepository {
	return &PostgresDormRepository{
		db: db,
	}
}

func (r *PostgresDormRepository) Create(dorm *entity.Dorm) error {
	query := `INSERT INTO dorms (id, seller_id, title, description, price, facilities, images, address, latitude, longitude, status, created_at)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
	_, err := r.db.Exec(context.Background(), query,
		dorm.ID, dorm.SellerID, dorm.Title, dorm.Description, dorm.Price,
		dorm.Facilities, dorm.Images, dorm.Address, dorm.Latitude, dorm.Longitude,
		dorm.Status, dorm.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to create dorm: %w", err)
	}
	return nil
}

func (r *PostgresDormRepository) GetByID(id uuid.UUID) (*entity.Dorm, error) {
	dorm := &entity.Dorm{}
	query := `SELECT id, seller_id, title, description, price, facilities, images, address, latitude, longitude, status, created_at FROM dorms WHERE id = $1`
	err := r.db.QueryRow(context.Background(), query, id).Scan(
		&dorm.ID, &dorm.SellerID, &dorm.Title, &dorm.Description, &dorm.Price,
		&dorm.Facilities, &dorm.Images, &dorm.Address, &dorm.Latitude, &dorm.Longitude,
		&dorm.Status, &dorm.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to get dorm: %w", err)
	}
	return dorm, nil
}

func (r *PostgresDormRepository) ListApproved(filters map[string]interface{}) ([]*entity.Dorm, error) {
	// Simple implementation, in a real project we would handle filters dynamically
	query := `SELECT id, seller_id, title, description, price, facilities, images, address, latitude, longitude, status, created_at FROM dorms WHERE status = 'approved'`
	rows, err := r.db.Query(context.Background(), query)
	if err != nil {
		return nil, fmt.Errorf("failed to list approved dorms: %w", err)
	}
	defer rows.Close()

	var dorms []*entity.Dorm
	for rows.Next() {
		dorm := &entity.Dorm{}
		err := rows.Scan(
			&dorm.ID, &dorm.SellerID, &dorm.Title, &dorm.Description, &dorm.Price,
			&dorm.Facilities, &dorm.Images, &dorm.Address, &dorm.Latitude, &dorm.Longitude,
			&dorm.Status, &dorm.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan dorm: %w", err)
		}
		dorms = append(dorms, dorm)
	}
	return dorms, nil
}

func (r *PostgresDormRepository) UpdateStatus(id uuid.UUID, status entity.DormStatus) error {
	query := `UPDATE dorms SET status = $1 WHERE id = $2`
	_, err := r.db.Exec(context.Background(), query, status, id)
	if err != nil {
		return fmt.Errorf("failed to update dorm status: %w", err)
	}
	return nil
}
