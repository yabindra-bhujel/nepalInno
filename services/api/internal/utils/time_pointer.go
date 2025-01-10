
package utils



import "time"



// TimePointer returns a pointer to the given time.Time value

func TimePointer(t time.Time) *time.Time {

    return &t

}
