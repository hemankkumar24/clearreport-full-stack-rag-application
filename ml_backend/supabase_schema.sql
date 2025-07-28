CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100),
  age INT,
  gender VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    report_name VARCHAR(255) NOT NULL,
    upload_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    extracted_text TEXT NOT NULL,
    text_language VARCHAR(255) NOT NULL,
    parsed_successfully BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS test_results  (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_value INT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    reference_range VARCHAR(255) NOT NULL,
    test_status VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS explanations  (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    explanation_text TEXT NOT NULL,
    test_value NUMERIC NOT NULL,
    text_language VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);