package usecase

import (
	"context"
	"time"

	"github.com/Devounn/DormHunt/internal/entity"
	"github.com/google/uuid"
)

type DormUseCase struct {
	dormRepo entity.DormRepository
}

func NewDormUseCase(repo entity.DormRepository) *DormUseCase {
	return &DormUseCase{
		dormRepo: repo,
	}
}

func (u *DormUseCase) CreateDorm(ctx context.Context, dorm *entity.Dorm) error {
	dorm.ID = uuid.New()
	dorm.CreatedAt = time.Now()
	dorm.Status = entity.StatusPending
	return u.dormRepo.Create(dorm)
}

func (u *DormUseCase) ListApprovedDorms(ctx context.Context, filters map[string]interface{}) ([]*entity.Dorm, error) {
	return u.dormRepo.ListApproved(filters)
}

func (u *DormUseCase) GetDormByID(ctx context.Context, id uuid.UUID) (*entity.Dorm, error) {
	return u.dormRepo.GetByID(id)
}
