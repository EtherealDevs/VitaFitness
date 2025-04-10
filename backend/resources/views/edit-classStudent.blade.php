<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Record Attendance</title>
    <style>
        body { font-family: Arial, sans-serif; }
        form { width: 300px; margin: 50px auto; }
        label, select, input { display: block; width: 100%; margin-bottom: 5px; }
        .success { color: green; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h2>Record Attendance</h2>

    @if (session('success'))
        <p class="success">{{ session('success') }}</p>
    @endif

    <form action="{{ route('testing.class.students.update', ['id' => $classScheduleTimeslot->id]) }}" method="POST">
        @csrf
        <input type="hidden" name="class_schedule_id" value="{{ $classSchedule->id }}">


        <button type="submit">Submit</button>
    </form>
</body>
</html>