export type QuestionType =
  | "STRING"
  | "TEXT"
  | "INTEGER"
  | "BIGINT"
  | "FLOAT"
  | "REAL"
  | "DOUBLE"
  | "DECIMAL"
  | "DATE"
  | "BOOLEAN"
  | "DROPDOWN"
  | "RATING"
  | "PERCENTAGE";

export type ParentType = "questionnaire" | "cluster" | "template";

// if QuestionType is 'RATING' or 'PERCENTAGE' (see QuestionCreateRequest), meta will be overwritten
export interface QuestionUpdateRequest
  extends Pick<
    Partial<QuestionAttributes>,
    "name" | "position" | "description" | "type" | "meta"
  > {}

// if QuestionType == 'RATING', Backend will overwrite meta with array '[1, 2, 3, 4, 5]'
// if QuestionType == 'PERCENTAGE', Backend will overwrite meta with array '[1, 2, ..., 100]'
export interface QuestionCreateRequest
  extends Pick<
    QuestionAttributes,
    "name" | "position" | "description" | "type" | "meta"
  > {
  parentId: string;
  parentType: ParentType;
}

export default interface QuestionAttributes {
  id: string;
  name: string;
  position: number;
  description: string;
  type: QuestionType;
  meta: string;
  questionnaireId?: string;
  groupId?: string;
}

export interface QuestionPresentable extends QuestionAttributes {}
