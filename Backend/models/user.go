package models

type User struct {
	ID       int    `json:"id"`
	Name     int    `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
