SELECT d.timeslice
     , TRUNCATE(AVG(h.volt), 2) AS volt
     , TRUNCATE(AVG(h.amps), 2) AS amps
     , TRUNCATE(volt * amps, 2) AS voltamps
  FROM ( SELECT min_date + INTERVAL n*1 HOUR AS timeslice
           FROM ( SELECT DATE('2018-04-08') AS min_date
                       , DATE('2018-04-12') AS max_date ) AS m
         CROSS
           JOIN numbers
          WHERE min_date + INTERVAL n*1 HOUR <= max_date
       ) AS d
LEFT
  JOIN healthlog AS h
    ON h.sendtime BETWEEN d.timeslice
                        AND d.timeslice + INTERVAL 1 HOUR
GROUP BY d.timeslice