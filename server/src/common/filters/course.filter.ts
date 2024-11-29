import { Model } from 'mongoose';
import { Course } from '../constants/interfaces';

export interface FilterParams {
  level?: string;
  fee?: 'FREE' | 'PAID';
  topic?: string;
  status?: 'ANNOUNCED' | 'ACTIVE' | 'ARCHIVED';
  search?: string;
  offset?: number;
  limit?: number;
}

export async function filterCourses(
  courseModel: Model<Course>,
  params: FilterParams,
) {
  const { level, fee, topic, status, search, offset = 0, limit = 10 } = params;

  const filter: Record<string, any> = {};

  if (level) {
    const levels = level.split(',').map((l) => parseInt(l, 10));
    filter.course_difficulty_level = { $in: levels };
  }

  if (fee) {
    filter.course_fee = fee;
  }

  if (topic) {
    const topics = topic.split(',');
    filter.course_topics = { $in: topics };
  }

  if (status) {
    const statuses = status.split(',');
    filter.course_status = { $in: statuses };
  }

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { 'course_name.en': regex },
      { 'course_name.ru': regex },
      { 'course_short_description.en': regex },
      { 'course_short_description.ru': regex },
    ];
  }

  const courses = await courseModel
    .find(filter)
    .skip(offset)
    .limit(limit)
    .exec();

  return courses;
}
