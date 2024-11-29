import { model, Schema } from 'mongoose';
import { CourseStatus } from 'src/common/constants/enum';
import { CourseTopic } from 'src/common/constants/interfaces';

export const CourseTopicSchema = new Schema<CourseTopic>({
  course_topic_name: {
    type: String,
    required: true,
    maxlength: 50,
    index: true,
  },
  course_topic_status: {
    type: String,
    enum: Object.values(CourseStatus),
    required: true,
  },
});

export const CourseTopicModel = model<CourseTopic>(
  'CourseTopic',
  CourseTopicSchema,
);
