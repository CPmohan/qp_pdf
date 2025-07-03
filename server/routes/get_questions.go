package routes

import (
	"fmt"
	"qb_pdf/config"
	"qb_pdf/functions"
	"strings"

	"github.com/gin-gonic/gin"
)

type QuestionDetails struct {
	CourseName      string  `json:"course_name"`
	Question        string  `json:"question"`
	Topic           *string `json:"topic"`
	Answer          string  `json:"answer"`
	CourseCo        string  `json:"course_co"`
	CoursePart      string  `json:"co_part"`
	DifficultyLevel string  `json:"difficulty_level"`
	Mark            int     `json:"mark"`
	RDT             string  `json:"rdt"`
	Knowledge       string  `json:"knowledge"`
	Cognitive       string  `json:"cognitive"`
	Remarks         string  `json:"remarks"`
	RemarksCategory string  `json:"remarks_category"`
	Status          string  `json:"status"`
}

type Input struct {
	AccademicYear string `json:"academic_year"`
	Sem           string `json:"sem"`
	CourseId      string `json:"courseId"`
}

func GetQuestions(c *gin.Context) {
	sem := c.Param("sem")
	ayId := c.Param("academic_year")
	courseId := c.Param("courseId")

	// Wildcard param includes a leading `/`, remove it
	courseId = strings.TrimPrefix(courseId, "/")
	courseId = strings.TrimSpace(courseId)
	courseId = strings.Trim(courseId, "()")

	fmt.Println("AY:", ayId)
	fmt.Println("Sem:", sem)
	fmt.Println("CourseId:", courseId)
	data := []QuestionDetails{}

	row, err := config.Database.Query(`select ac.course_name,question,answer,course_co,co_part,difficulty_level,mark,cognitive,knowledge,
									 IFNULL(remark_category,''),IFNULL(remarks,''),q.status,IFNULL(concat(act.topic_no," - ",act.topic_name),'') from coe_question_bank q inner join aca_courses ac on ac.course_code = q.course_code
									 left join aca_course_topics act on act.id = q.topic 
									 inner join aca_academic_year ay on ay.id = q.academic_year
									 where q.course_code = ? and q.status ='1' AND q.academic_year =(select yy.id from aca_academic_year yy where yy.academic_year = ? and yy.sem = ?)
									 order by q.course_co,q.co_part,q.mark`, courseId, ayId, sem)
	if err != nil {
		functions.Response(c, 500, err.Error(), nil)
		return
	}
	for row.Next() {
		var temp QuestionDetails

		err := row.Scan(&temp.CourseName, &temp.Question, &temp.Answer, &temp.CourseCo, &temp.CoursePart, &temp.DifficultyLevel, &temp.Mark, &temp.Cognitive, &temp.Knowledge, &temp.RemarksCategory, &temp.Remarks, &temp.Status, &temp.Topic)
		if err != nil {
			functions.Response(c, 500, err.Error(), nil)
			return
		}

		cog := strings.Split(temp.Cognitive, " - ")
		know := strings.Split(temp.Knowledge, " - ")
		diff := strings.Split(temp.DifficultyLevel, " - ")

		if len(cog) > 1 && len(know) > 1 && len(diff) > 1 {
			temp.RDT = "[" + cog[1] + "/" + know[1] + ", " + diff[1] + "]"
		}

		coPath := temp.CoursePart
		temp.CourseCo = temp.CourseCo + "(" + coPath + ")"

		data = append(data, temp)
	}

	functions.Response(c, 200, "", map[string]interface{}{"question_details": data})
}

// for row.Next() {
// 	var temp QuestionDetails

// 	row.Scan(&temp.CourseName, &temp.Question, &temp.Answer, &temp.CourseCo, &temp.CoursePart, &temp.DifficultyLevel, &temp.Mark, &temp.Cognitive, &temp.Knowledge, &temp.RemarksCategory, &temp.Remarks, &temp.Status, &temp.Topic)
// 	data = append(data, temp)

// 	data.RDT = "[" + strings.Split(data.Cognitive, " - ")[1] + "/" + strings.Split(data.Knowledge, " - ")[1] + ", " + strings.Split(data.DifficultyLevel, " - ")[1] + "]"

// 	data.CourseCo = data.CourseCo + "(" + coPath + ")"

// }
