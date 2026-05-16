CREATE TABLE "x_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"headline" varchar(500) NOT NULL,
	"tweet_text" text NOT NULL,
	"tweet_id" varchar(50),
	"source" varchar(200),
	"news_link" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
