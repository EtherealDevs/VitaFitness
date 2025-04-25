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

    <form action="{{ route('testing.classSchedule.store') }}" method="POST">
        @csrf

        <label for="class_id">Class:</label>
        <select name="class_id" required>
            <option value="">Select Class</option>
            @foreach ($classes as $class)
                <option value="{{ $class->id }}">Class {{ $class->id }} - plan {{$class->plan->name}}</option> 
            @endforeach
        </select>
        <div class="checkbox-group">
            <label><input type="checkbox" name="days[]" value="lunes"> Lunes</label>
            <label><input type="checkbox" name="days[]" value="martes"> Martes</label>
            <label><input type="checkbox" name="days[]" value="miercoles"> Miércoles</label>
            <label><input type="checkbox" name="days[]" value="jueves"> Jueves</label>
            <label><input type="checkbox" name="days[]" value="viernes"> Viernes</label>
            <label><input type="checkbox" name="days[]" value="sabado"> Sábado</label>
            <label><input type="checkbox" name="days[]" value="domingo"> Domingo</label>
        </div>
        <label for="time_start">Hora de inicio:</label>
        <input type="time" name="time_start" id="time_start" required>

        <label for="time_end">Hora de fin:</label>
        <input type="time" name="time_end" id="time_end" required>

        <button type="submit">Submit</button>
    </form>
</body>
</html>