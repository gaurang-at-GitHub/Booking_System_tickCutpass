CREATE TABLE seats [icon : chair]{
  id Serial PK
  name VARCHAR 255 FK
  isbooked INT DEFAULT 0
}

 users [icon: user] {
  id INT PK
  name VARCHAR 45 NOT NULL
  email VARCHAR 255 UNIQUE NOT NULL
  hashedPassword VARCHAR 45 NOT NULL
  phone VARCHAR 15 UNIQUE NOT NULL
  role ENUM[Customer, Owner] DEFAULT Customer
  hashedVerificationToken VARCHAR 255
  refreshToken VARCHAR 255
  hashedResetToken VARCHAR 255
  isVerified BOOLEAN DEFAULT FALSE
 }

 

Seats.name - Users.name
