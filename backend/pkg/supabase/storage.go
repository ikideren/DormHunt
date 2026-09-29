package supabase

import (
	"fmt"
	"os"
)

type SupabaseStorage struct {
	projectURL string
	apiKey     string
	bucketName string
}

func NewSupabaseStorage() *SupabaseStorage {
	return &SupabaseStorage{
		projectURL: os.Getenv("SUPABASE_URL"),
		apiKey:     os.Getenv("SUPABASE_KEY"),
		bucketName: "dorm-images",
	}
}

func (s *SupabaseStorage) UploadImage(fileName string, fileData []byte) (string, error) {
	// Implementation would use Supabase Go SDK or REST API to upload to bucket
	// For now, return a dummy public URL
	publicURL := fmt.Sprintf("%s/storage/v1/object/public/%s/%s", s.projectURL, s.bucketName, fileName)
	return publicURL, nil
}
